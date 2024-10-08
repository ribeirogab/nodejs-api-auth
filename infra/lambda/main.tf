provider "aws" {
  region = var.aws_region
}

data "aws_caller_identity" "current" {}

# DynamoDB Table for storing the authentication resources
resource "aws_dynamodb_table" "auth_resource_table" {
  name         = "${var.environment}-${var.dynamodb_table_name}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK"
  range_key    = "SK"
  attribute {
    name = "PK"
    type = "S"
  }
  attribute {
    name = "SK"
    type = "S"
  }
  ttl {
    attribute_name = "TTL"
    enabled        = true
  }
  tags = {
    Environment = var.environment
  }
}

# Environment variable for the authentication JWT secret
data "aws_ssm_parameter" "jwt_secret" {
  name = "/${var.environment}/authentication-jwt-secret"
}

# Environment variable for the verification code JWT secret
data "aws_ssm_parameter" "verification_code_jwt_secret" {
  name = "/${var.environment}/verification-code-jwt-secret"
}

# Environment variable for the Resend API key
data "aws_ssm_parameter" "resend_api_key" {
  name = "/${var.environment}/resend-api-key"
}

# Environment variable for the default sender email 
data "aws_ssm_parameter" "default_sender_email" {
  name = "/${var.environment}/default-sender-email"
}

# Lambda Function for Node.js
resource "aws_lambda_function" "nodejs_api_authentication_lambda" {
  function_name    = "${var.environment}-${var.project_name}"
  handler          = "lambda.handler"
  runtime          = "nodejs20.x"
  role             = aws_iam_role.lambda_exec_role.arn
  source_code_hash = filebase64sha256("${path.module}/../../dist.zip")
  filename         = "${path.module}/../../dist.zip"
  timeout          = 10
  layers = [
    aws_lambda_layer_version.node_modules.arn
  ]
  environment {
    variables = {
      NODE_ENV                      = "production"
      STAGE                         = var.environment
      JWT_SECRET                    = data.aws_ssm_parameter.jwt_secret.value
      JWT_SECRET_VERIFICATION_TOKEN = data.aws_ssm_parameter.verification_code_jwt_secret.value
      FRONTEND_CONFIRM_SIGN_UP_URL  = var.frontend_confirm_sign_up_url
      FRONTEND_CONFIRM_SIGN_IN_URL  = var.frontend_confirm_sign_in_url
      AWS_DYNAMO_TABLE_NAME         = aws_dynamodb_table.auth_resource_table.name
      DEFAULT_SENDER_EMAIL          = data.aws_ssm_parameter.default_sender_email.value
      RESEND_API_KEY                = data.aws_ssm_parameter.resend_api_key.value
    }
  }
  tags = {
    Environment = var.environment
  }
}

# Lambda Layer for Node.js modules
resource "aws_lambda_layer_version" "node_modules" {
  filename            = "${path.module}/../../nodejs-layer.zip"
  layer_name          = "${var.environment}-${var.project_name}"
  compatible_runtimes = ["nodejs20.x"]
  source_code_hash    = filebase64sha256("${path.module}/../../nodejs-layer.zip")
}

# IAM Role for Lambda
resource "aws_iam_role" "lambda_exec_role" {
  name = "${var.environment}-${var.project_name}-iam-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
  inline_policy {
    name = "${var.environment}-${var.project_name}-policy"
    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Action = [
            "dynamodb:PutItem",
            "dynamodb:GetItem",
            "dynamodb:UpdateItem",
            "dynamodb:DeleteItem",
            "dynamodb:Query",
            "dynamodb:Scan"
          ]
          Effect = "Allow"
          Resource = [
            "${aws_dynamodb_table.auth_resource_table.arn}"
          ]
        },
        {
          Action = [
            "ssm:GetParameter",
            "ssm:GetParameters",
            "ssm:GetParameterHistory"
          ]
          Effect = "Allow"
          Resource = [
            "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/${var.environment}/authentication-jwt-secret",
            "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/${var.environment}/verification-code-jwt-secret",
            "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/${var.environment}/resend-api-key",
            "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/${var.environment}/default-sender-email"
          ]
        },
        {
          Action = [
            "ec2:DescribeInstances",
            "ec2:CreateNetworkInterface",
            "ec2:AttachNetworkInterface",
            "ec2:DescribeNetworkInterfaces",
            "ec2:DeleteNetworkInterface"
          ]
          Effect   = "Allow"
          Resource = "*"
        }
      ]
    })
  }
  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
    "arn:aws:iam::aws:policy/CloudWatchFullAccess"
  ]
  lifecycle {
    create_before_destroy = true
  }
  tags = {
    Environment = var.environment
  }
}

# API Gateway REST API for Lambda integration
resource "aws_api_gateway_rest_api" "nodejs_api_authentication_apigateway" {
  name = "${var.environment}-${var.project_name}-apigateway"
  tags = {
    Environment = var.environment
  }
}

# Proxy Resource - Accepts any path {proxy+}
resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.nodejs_api_authentication_apigateway.id
  parent_id   = aws_api_gateway_rest_api.nodejs_api_authentication_apigateway.root_resource_id
  path_part   = "{proxy+}"
}

# ANY method - Accepts any HTTP method
resource "aws_api_gateway_method" "any_method" {
  rest_api_id   = aws_api_gateway_rest_api.nodejs_api_authentication_apigateway.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "ANY"
  authorization = "NONE"
}

# Lambda integration with Proxy for ANY method
resource "aws_api_gateway_integration" "lambda_integration" {
  rest_api_id             = aws_api_gateway_rest_api.nodejs_api_authentication_apigateway.id
  resource_id             = aws_api_gateway_resource.proxy.id
  http_method             = aws_api_gateway_method.any_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.nodejs_api_authentication_lambda.invoke_arn
}

# API Gateway deployment to the 'prod' stage
resource "aws_api_gateway_deployment" "api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.nodejs_api_authentication_apigateway.id
  stage_name  = var.environment
  depends_on = [
    aws_api_gateway_method.any_method,
    aws_api_gateway_integration.lambda_integration
  ]
}

# Permission for API Gateway to invoke the Lambda function
resource "aws_lambda_permission" "api_gateway_permission" {
  statement_id  = "${var.environment}-AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.nodejs_api_authentication_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.nodejs_api_authentication_apigateway.execution_arn}/*/*"
}
