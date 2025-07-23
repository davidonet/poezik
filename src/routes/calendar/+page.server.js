export async function load({ url }) {
  const subscriptionUrl = `${url.origin}/calendar`

  return {
    subscriptionUrl,
  }
}
