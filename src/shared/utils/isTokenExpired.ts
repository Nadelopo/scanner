export const isTokenExpired = (token: string) => {
  const payloadBase64 = token.split('.')[1]

  if (!payloadBase64) {
    return true
  }

  const payload = JSON.parse(atob(payloadBase64))

  if (!payload.exp) {
    return true
  }

  const currentTime = Math.floor(Date.now() / 1000)

  return payload.exp < currentTime
}
