import {
  EMAIL_FROM,
  PUBLIC_BASE_URL,
  SCW_DEFAULT_PROJECT_ID,
  SCW_SECRET_KEY,
} from '$env/static/private'

const SCALEWAY_EMAIL_API =
  'https://api.scaleway.com/transactional-email/v1alpha1/regions/fr-par/emails'

export async function sendMagicLinkEmail(email, token) {
  const magicLink = `${PUBLIC_BASE_URL || 'http://localhost:5173'}/auth/verify?token=${token}`

  const emailData = {
    from: {
      email: EMAIL_FROM || 'noreply@poezik.com',
      name: 'Poezik',
    },
    to: [
      {
        email: email,
      },
    ],
    subject: 'Your magic link for Poezik',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Welcome to Poezik</h1>
        <p>Click the link below to sign in:</p>
        <a href="${magicLink}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Sign in to Poezik
        </a>
        <p style="margin-top: 20px; color: #666;">
          This link will expire in 15 days. If you didn't request this email, you can safely ignore it.
        </p>
      </div>
    `,
    text: `Sign in to Poezik: ${magicLink}\n\nThis link will expire in 15 days.`,
    project_id: SCW_DEFAULT_PROJECT_ID,
  }

  const response = await fetch(SCALEWAY_EMAIL_API, {
    method: 'POST',
    headers: {
      'X-Auth-Token': SCW_SECRET_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to send email: ${error}`)
  }

  return response.json()
}
