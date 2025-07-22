import { env } from '$env/dynamic/private'
const {
  EMAIL_FROM,
  VERCEL_PROJECT_PRODUCTION_URL,
  SCW_DEFAULT_PROJECT_ID,
  SCW_SECRET_KEY,
} = env

const SCALEWAY_EMAIL_API =
  'https://api.scaleway.com/transactional-email/v1alpha1/regions/fr-par/emails'

export async function sendMagicLinkEmail(email, token) {
  const magicLink = `${'https://' + VERCEL_PROJECT_PRODUCTION_URL || 'http://localhost:5173'}/auth/verify?token=${token}`
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
    subject: 'Votre lien magique pour Poezik',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Bienvenue sur Poezik</h1>
        <p>Cliquez sur le lien ci-dessous pour vous connecter :</p>
        <a href="${magicLink}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Se connecter à Poezik
        </a>
        <p style="margin-top: 20px; color: #666;">
          Ce lien expirera dans 15 jours. Si vous n'avez pas demandé cet email, vous pouvez l'ignorer en toute sécurité.
        </p>
      </div>
    `,
    text: `Se connecter à Poezik : ${magicLink}\n\nCe lien expirera dans 15 jours.`,
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
