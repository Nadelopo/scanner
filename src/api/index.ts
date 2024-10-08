import { getAccessToken, refreshToken } from './services/auth'

export type ApiResponse<T> = { data: T; error: null } | { data: null; error: Error }

export const delay = (ms: number = 100) => new Promise((resolve) => setTimeout(resolve, ms))

export const myFetch = async (url: string, options: RequestInit) => {
  const access = await getAccessToken()

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${access}`
  }

  const response = await fetch(url, options)

  if (response.status === 401) {
    const { token } = await refreshToken()
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`
    }
    return fetch(url, options)
  }

  return response
}
