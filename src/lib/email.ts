import nodemailer from 'nodemailer';
import { SendVerificationRequestParams } from 'next-auth/providers/email';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendVerificationRequest(params: SendVerificationRequestParams) {
  const { identifier: to, url, provider } = params;

  try {
    const result = await transporter.sendMail({
      to,
      from: provider.from,
      subject: 'Sign in to Foreign Housing',
      text: textContent({ url }),
      html: htmlContent({ url }),
    });

    console.log('Email sent:', result);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

function textContent({ url }: { url: string }) {
  return `Sign in to Foreign Housing\n\nClick the link below to sign in:\n${url}\n\n`;
}

function htmlContent({ url }: { url: string }) {
  const brandColor = '#2563eb';
  const buttonText = '#fff';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in to Foreign Housing</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 20px; color: #111827; font-size: 24px; font-weight: 600;">Sign in to Foreign Housing</h1>
              <p style="margin: 0 0 30px; color: #6b7280; font-size: 16px; line-height: 1.5;">
                Click the button below to sign in to your account. This link will expire in 24 hours.
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="border-radius: 6px; background-color: ${brandColor};">
                    <a href="${url}" target="_blank" style="display: inline-block; padding: 16px 32px; color: ${buttonText}; text-decoration: none; font-size: 16px; font-weight: 600;">
                      Sign In
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 30px 0 0; color: #9ca3af; font-size: 14px; line-height: 1.5;">
                If you didn't request this email, you can safely ignore it.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 12px; text-align: center;">
                © 2024 Foreign Housing. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    await transporter.sendMail({
      to,
      from: process.env.EMAIL_FROM!,
      subject: 'Welcome to Foreign Housing!',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to Foreign Housing</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1>Welcome to Foreign Housing, ${name}!</h1>
    <p>We're excited to have you join our community of property seekers and reviewers.</p>
    <p>With your account, you can:</p>
    <ul>
      <li>Save favorite properties</li>
      <li>Write and read property reviews</li>
      <li>Get personalized property recommendations</li>
      <li>Connect with landlords and agents</li>
    </ul>
    <p>Start exploring properties now!</p>
    <a href="${process.env.NEXTAUTH_URL}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">Browse Properties</a>
    <p style="margin-top: 30px; font-size: 12px; color: #666;">
      If you have any questions, feel free to contact us.
    </p>
  </div>
</body>
</html>
      `,
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}

export async function sendReviewNotification(to: string, propertyTitle: string, reviewerName: string) {
  try {
    await transporter.sendMail({
      to,
      from: process.env.EMAIL_FROM!,
      subject: 'New Review on Your Property',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>New Review</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1>New Review Posted</h1>
    <p>Hi there,</p>
    <p><strong>${reviewerName}</strong> has posted a new review on <strong>${propertyTitle}</strong>.</p>
    <p>Log in to your account to view the review and respond.</p>
    <a href="${process.env.NEXTAUTH_URL}/profile/reviews" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">View Review</a>
  </div>
</body>
</html>
      `,
    });
  } catch (error) {
    console.error('Error sending review notification:', error);
  }
}
