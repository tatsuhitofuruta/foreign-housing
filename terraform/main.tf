terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "foreign-housing-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "ap-northeast-1"
    encrypt = true
    dynamodb_table = "foreign-housing-terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "foreign-housing"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}
