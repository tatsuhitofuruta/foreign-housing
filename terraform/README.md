# Terraform Infrastructure

This directory contains Terraform configuration for deploying Foreign Housing infrastructure on AWS.

## Architecture

- **VPC**: Multi-AZ VPC with public, private, and database subnets
- **RDS**: PostgreSQL 15.5 with RDS Proxy for connection pooling
- **S3**: Image storage with versioning and lifecycle policies
- **CloudFront**: CDN for image delivery
- **Cognito**: User authentication and authorization
- **SES**: Email notifications and transactional emails
- **Secrets Manager**: Secure credential storage

## Prerequisites

- Terraform >= 1.5.0
- AWS CLI configured with appropriate credentials
- S3 bucket for Terraform state (create manually first)
- DynamoDB table for state locking (create manually first)

## Setup

### 1. Create State Backend Resources

```bash
# Create S3 bucket for state
aws s3api create-bucket \
  --bucket foreign-housing-terraform-state \
  --region ap-northeast-1 \
  --create-bucket-configuration LocationConstraint=ap-northeast-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket foreign-housing-terraform-state \
  --versioning-configuration Status=Enabled

# Create DynamoDB table for state locking
aws dynamodb create-table \
  --table-name foreign-housing-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-northeast-1
```

### 2. Configure Variables

Create `terraform.tfvars`:

```hcl
aws_region  = "ap-northeast-1"
environment = "production"
domain_name = "foreign-housing.com"

# Database credentials (use secure values)
db_username = "admin"
db_password = "YourSecurePasswordHere123!"
```

**Important**: Never commit `terraform.tfvars` to version control!

### 3. Initialize Terraform

```bash
terraform init
```

### 4. Plan Infrastructure

```bash
terraform plan -out=tfplan
```

### 5. Apply Infrastructure

```bash
terraform apply tfplan
```

## Environment Variables for Application

After applying Terraform, set these environment variables in your application:

```bash
# From Terraform outputs
DATABASE_URL=$(terraform output -raw rds_endpoint)
S3_BUCKET_NAME=$(terraform output -raw s3_bucket_name)
CLOUDFRONT_DOMAIN=$(terraform output -raw cloudfront_distribution_domain)
COGNITO_USER_POOL_ID=$(terraform output -raw cognito_user_pool_id)
COGNITO_CLIENT_ID=$(terraform output -raw cognito_user_pool_client_id)

# Additional required variables
AWS_REGION=ap-northeast-1
NEXT_PUBLIC_AWS_REGION=ap-northeast-1
```

## Resource Costs Estimate

Approximate monthly costs (Tokyo region):

- **RDS db.t3.medium**: ~$80/month
- **NAT Gateway (2)**: ~$72/month
- **S3 Storage (100GB)**: ~$2.50/month
- **CloudFront**: ~$1/month (low traffic)
- **Cognito**: Free tier (up to 50,000 MAUs)
- **SES**: $0.10 per 1000 emails

**Total**: ~$155-200/month (varies with usage)

## Security Considerations

1. **Database**:
   - Encryption at rest enabled
   - Located in private subnets
   - Access via RDS Proxy only
   - Automated backups enabled

2. **S3**:
   - Versioning enabled
   - Public access blocked
   - Server-side encryption
   - Access via CloudFront only

3. **Cognito**:
   - Advanced security mode enabled
   - MFA support
   - Strong password policy

4. **Secrets**:
   - All credentials in Secrets Manager
   - Never hardcoded

## Backup and Disaster Recovery

- **RDS**: 7-day automatic backups, point-in-time recovery
- **S3**: Versioning enabled, lifecycle policies
- **Terraform State**: Versioned in S3

## Monitoring

- RDS Performance Insights enabled
- CloudWatch Logs for RDS
- SES event tracking for email metrics

## Cleanup

To destroy all resources:

```bash
# Disable deletion protection first
aws rds modify-db-instance \
  --db-instance-identifier foreign-housing-db \
  --no-deletion-protection

# Then destroy
terraform destroy
```

**Warning**: This will permanently delete all data!

## Outputs

Run `terraform output` to see all infrastructure endpoints and IDs.

## DNS Configuration

After applying Terraform, configure your DNS:

1. Point `foreign-housing.com` to your application (Vercel/ECS)
2. Add DKIM records for SES (from `terraform output`)
3. Add MX records if using SES for receiving

## Next Steps

1. Run database migrations
2. Configure application environment variables
3. Set up CI/CD pipeline
4. Configure monitoring and alerting
5. Test email delivery
6. Set up domain verification for SES
