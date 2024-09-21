variable "aws_region" {
  description = "The AWS region to create resources in"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "The environment for deployment (e.g., dev, prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "The project name for resource naming"
  type        = string
  default     = "nodejs-api-authentication"
}

variable "dynamodb_table_name" {
  description = "The name of the DynamoDB table"
  type        = string
  default     = "authentication"
}

variable "jwt_secret" {
  description = "JWT secret for authentication"
  type        = string
}

variable "verification_code_jwt_secret" {
  description = "JWT secret for verification code"
  type        = string
}

variable "resend_api_key" {
  description = "API key for Resend"
  type        = string
}

variable "default_sender_email" {
  description = "Default email for sending messages"
  type        = string
}

variable "frontend_confirm_sign_in_url" {
  description = "URL for the frontend confirm sign in"
  type        = string
}

variable "frontend_confirm_sign_up_url" {
  description = "URL for the frontend confirm sign up"
  type        = string
}

