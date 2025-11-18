# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in Foreign Housing, please report it by emailing **security@foreign-housing.com**.

**Please do not report security vulnerabilities through public GitHub issues.**

### What to include in your report:

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if any)

### Response Timeline:

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: 24-48 hours
  - High: 7 days
  - Medium: 30 days
  - Low: 90 days

## Security Best Practices

### For Users:

1. Keep your password secure and unique
2. Enable MFA when available
3. Do not share account credentials
4. Report suspicious activity immediately

### For Developers:

1. Never commit secrets or credentials
2. Use environment variables for sensitive data
3. Keep dependencies up to date
4. Follow OWASP security guidelines
5. Run security scans before deploying

## Known Security Considerations

### Authentication
- Implemented with NextAuth.js
- Supports Google OAuth and email authentication
- Session tokens are httpOnly and secure

### Data Protection
- All data encrypted at rest (AWS RDS encryption)
- All data encrypted in transit (TLS/HTTPS)
- Passwords never stored (OAuth only)

### Rate Limiting
- API endpoints have rate limiting
- Failed login attempts are tracked
- Brute force protection enabled

### Input Validation
- All user inputs are validated and sanitized
- SQL injection protection via Prisma ORM
- XSS protection via DOMPurify

### Infrastructure Security
- VPC with private subnets for database
- Security groups with minimal access
- IAM roles with least privilege principle
- Regular security audits via GitHub Actions

## Security Headers

The following security headers are implemented:

- `Strict-Transport-Security`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `X-XSS-Protection`
- `Content-Security-Policy`
- `Referrer-Policy`
- `Permissions-Policy`

## Compliance

- GDPR compliant (EU data protection)
- CCPA compliant (California privacy)
- SOC 2 Type II in progress

## Third-Party Services

We use the following trusted third-party services:

- **AWS**: Infrastructure (RDS, S3, CloudFront, SES)
- **Vercel**: Application hosting
- **Google**: OAuth authentication
- **GitHub**: Code repository and CI/CD

## Security Audit Log

| Date       | Finding                | Severity | Status   |
| ---------- | ---------------------- | -------- | -------- |
| 2024-11-18 | Initial security setup | Info     | Complete |

---

Last updated: 2024-11-18
