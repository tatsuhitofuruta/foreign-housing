# SES Email Identity
resource "aws_ses_email_identity" "main" {
  email = "noreply@${var.domain_name}"
}

# SES Domain Identity (if using custom domain)
resource "aws_ses_domain_identity" "main" {
  domain = var.domain_name
}

# SES Domain DKIM
resource "aws_ses_domain_dkim" "main" {
  domain = aws_ses_domain_identity.main.domain
}

# SES Configuration Set
resource "aws_ses_configuration_set" "main" {
  name = "${var.project_name}-config-set"

  delivery_options {
    tls_policy = "Require"
  }

  reputation_metrics_enabled = true
}

# SES Event Destination for bounce/complaint tracking
resource "aws_ses_event_destination" "cloudwatch" {
  name                   = "cloudwatch-destination"
  configuration_set_name = aws_ses_configuration_set.main.name
  enabled                = true
  matching_types         = ["send", "reject", "bounce", "complaint", "delivery"]

  cloudwatch_destination {
    default_value  = "default"
    dimension_name = "ses:configuration-set"
    value_source   = "messageTag"
  }
}

# SNS Topic for bounce notifications
resource "aws_sns_topic" "ses_bounces" {
  name = "${var.project_name}-ses-bounces"

  tags = {
    Name = "${var.project_name}-ses-bounces"
  }
}

resource "aws_ses_identity_notification_topic" "bounces" {
  topic_arn                = aws_sns_topic.ses_bounces.arn
  notification_type        = "Bounce"
  identity                 = aws_ses_domain_identity.main.domain
  include_original_headers = true
}

resource "aws_ses_identity_notification_topic" "complaints" {
  topic_arn                = aws_sns_topic.ses_bounces.arn
  notification_type        = "Complaint"
  identity                 = aws_ses_domain_identity.main.domain
  include_original_headers = true
}

# IAM User for SMTP credentials
resource "aws_iam_user" "ses_smtp" {
  name = "${var.project_name}-ses-smtp"
  path = "/system/"

  tags = {
    Name = "${var.project_name}-ses-smtp"
  }
}

resource "aws_iam_access_key" "ses_smtp" {
  user = aws_iam_user.ses_smtp.name
}

resource "aws_iam_user_policy" "ses_smtp" {
  name = "${var.project_name}-ses-smtp-policy"
  user = aws_iam_user.ses_smtp.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ses:SendEmail",
          "ses:SendRawEmail"
        ]
        Resource = "*"
      }
    ]
  })
}

# Store SMTP credentials in Secrets Manager
resource "aws_secretsmanager_secret" "ses_smtp" {
  name        = "${var.project_name}-ses-smtp-credentials"
  description = "SMTP credentials for SES"
}

resource "aws_secretsmanager_secret_version" "ses_smtp" {
  secret_id = aws_secretsmanager_secret.ses_smtp.id
  secret_string = jsonencode({
    username = aws_iam_access_key.ses_smtp.id
    password = aws_iam_access_key.ses_smtp.ses_smtp_password_v4
    host     = "email-smtp.${var.aws_region}.amazonaws.com"
    port     = 587
  })
}
