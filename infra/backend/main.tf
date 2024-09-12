provider "aws" {
  region = "us-east-1"
}

resource "aws_dynamodb_table" "terraform_lock_table" {
  name         = "terraform-lock-table"
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

resource "aws_s3_bucket" "terraform_states_bucket" {
  bucket = "terraform-states-${random_string.bucket_suffix.result}"

  tags = {
    Name = "terraform-states"
  }
}

resource "aws_s3_bucket_versioning" "terraform_states_versioning" {
  bucket = aws_s3_bucket.terraform_states_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}
