output "api_gateway_url" {
  description = "The invoke URL of the API Gateway"
  value       = "https://${aws_api_gateway_rest_api.nodejs_api_authentication_apigateway.id}.execute-api.${var.aws_region}.amazonaws.com/${aws_api_gateway_deployment.api_deployment.stage_name}/test"
}
