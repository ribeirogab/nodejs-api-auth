terraform {
  backend "s3" {
    bucket         = "terraform-states-1x0pom65"
    region         = "us-east-1"
    dynamodb_table = "terraform-lock-table"
    encrypt        = true
  }
}
