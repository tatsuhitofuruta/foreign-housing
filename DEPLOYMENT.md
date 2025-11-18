# Deployment Guide

This guide covers deploying the Foreign Housing platform to production.

## Prerequisites

- AWS Account with appropriate permissions
- Terraform installed (>= 1.5.0)
- Node.js 20.x or higher
- PostgreSQL 15.x
- Domain name configured

## Infrastructure Setup

### 1. Deploy AWS Infrastructure with Terraform

```bash
cd terraform

# Initialize Terraform
terraform init

# Create terraform.tfvars file
cp terraform.tfvars.example terraform.tfvars

# Edit terraform.tfvars with your values
nano terraform.tfvars

# Plan infrastructure
terraform plan -out=tfplan

# Apply infrastructure
terraform apply tfplan
```

### 2. Configure Environment Variables

After Terraform deployment, collect the outputs:

```bash
terraform output
```

Create `.env.production` file in the root directory:

```env
# Database (from Terraform output)
DATABASE_URL=postgresql://admin:password@your-rds-endpoint:5432/foreignhousing

# NextAuth.js
NEXTAUTH_SECRET=your-production-secret-here
NEXTAUTH_URL=https://foreign-housing.com

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AWS (from Terraform output)
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET_NAME=foreign-housing-images-production

# CloudFront
NEXT_PUBLIC_CLOUDFRONT_DOMAIN=d123456789.cloudfront.net

# SES (from Secrets Manager)
EMAIL_SERVER_HOST=email-smtp.ap-northeast-1.amazonaws.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-ses-user
EMAIL_SERVER_PASSWORD=your-ses-password
EMAIL_FROM=noreply@foreign-housing.com

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-maps-key
```

## Database Migration

### Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed initial data (optional)
npm run db:seed
```

## Application Deployment

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Configure Environment Variables in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.production`

### Option 2: AWS ECS/Fargate

1. Build Docker image:
```bash
docker build -t foreign-housing:latest .
```

2. Push to ECR:
```bash
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.ap-northeast-1.amazonaws.com
docker tag foreign-housing:latest your-account.dkr.ecr.ap-northeast-1.amazonaws.com/foreign-housing:latest
docker push your-account.dkr.ecr.ap-northeast-1.amazonaws.com/foreign-housing:latest
```

3. Deploy to ECS (configure via Terraform or AWS Console)

## DNS Configuration

### Route53 Setup

1. Create hosted zone in Route53
2. Add A record pointing to Vercel/ECS Load Balancer
3. Add CNAME records for SES verification

### SES Email Verification

1. Verify domain:
```bash
aws ses verify-domain-identity --domain foreign-housing.com
```

2. Add TXT records from Terraform output to your DNS:
   - DKIM records
   - SPF record
   - DMARC record

## Post-Deployment

### 1. Health Check

```bash
curl https://foreign-housing.com/api/health
```

### 2. Database Connection Test

```bash
curl https://foreign-housing.com/api/properties
```

### 3. Email Test

Test email sending through the admin panel or:

```bash
curl -X POST https://foreign-housing.com/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com"}'
```

## Monitoring

### CloudWatch Logs

- Application logs: `/aws/lambda/foreign-housing`
- RDS logs: `/aws/rds/instance/foreign-housing-db/postgresql`
- ALB logs: Stored in S3

### Performance Monitoring

- RDS Performance Insights
- CloudFront metrics
- Application monitoring via Vercel Analytics

## Backup Strategy

### Database Backups

- Automated daily backups (7-day retention)
- Manual snapshots before major changes

```bash
aws rds create-db-snapshot \
  --db-instance-identifier foreign-housing-db \
  --db-snapshot-identifier manual-backup-$(date +%Y%m%d)
```

### S3 Backups

- Versioning enabled
- Lifecycle policies configured

## Rollback Procedure

### Application Rollback (Vercel)

```bash
vercel rollback
```

### Database Rollback

```bash
# Restore from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier foreign-housing-db-restored \
  --db-snapshot-identifier snapshot-name
```

## Security Checklist

- [ ] All environment variables set in production
- [ ] Database password rotated
- [ ] SES DKIM configured
- [ ] CloudFront HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] API authentication tested

## Troubleshooting

### Database Connection Issues

1. Check security group rules
2. Verify RDS endpoint
3. Test with psql:
```bash
psql -h your-rds-endpoint -U admin -d foreignhousing
```

### S3 Upload Issues

1. Verify IAM permissions
2. Check bucket policy
3. Test presigned URLs

### Email Delivery Issues

1. Check SES sending limits
2. Verify domain verification
3. Review bounce/complaint rates

## Scaling

### Database Scaling

- Vertical: Modify instance class via Terraform
- Read replicas: Add in `terraform/rds.tf`

### Application Scaling

- Vercel: Automatic
- ECS: Modify desired count in task definition

## Cost Optimization

- Use Reserved Instances for RDS
- Configure S3 lifecycle policies
- Enable CloudFront caching
- Review CloudWatch logs retention

## Support

For deployment issues, contact the development team or refer to:
- [Terraform Documentation](terraform/README.md)
- [API Documentation](docs/API.md)
- [GitHub Issues](https://github.com/your-org/foreign-housing/issues)
