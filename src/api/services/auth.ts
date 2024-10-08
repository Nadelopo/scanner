import { openDB } from 'idb'
import { delay, myFetch, type ApiResponse } from '..'

export type AuthData = {
  accessToken: string
}

type RefreshResponse<T> = { token: T; error: null } | { token: null; error: Error }

type ResRej = {
  resolve: (value: RefreshResponse<string>) => void
  reject: (reason?: RefreshResponse<string>) => void
}

export const getAccessToken = async (): Promise<string | null> => {
  const db = await openDB('app-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.length) {
        db.createObjectStore('auth', { keyPath: 'id' })
        db.createObjectStore('tariffs', { keyPath: 'id' })
      }
    }
  })
  const data: { id: number; token: string } | undefined = await db.get('auth', 1)
  return data?.token ?? null
}

let isRefreshing = false
let failedRequests: ResRej[] = []

export const refreshToken = async (): Promise<RefreshResponse<string>> => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedRequests.push({ resolve, reject })
    })
  }

  isRefreshing = true

  try {
    const response = await fetch('auth.json', {
      // method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json'
      // },
      // body: JSON.stringify({
      //   refresh_token: refreshToken
      // })
    })

    if (!response.ok) {
      throw new Error('Failed to refresh token')
    }

    const data: AuthData = await response.json()
    const newAccessToken: string = data.accessToken

    const db = await openDB('app-db', 1)
    db.put('auth', { id: '1', token: newAccessToken })
    const result = { token: newAccessToken, error: null }
    failedRequests.forEach((request) => request.resolve(result))

    return result
  } catch (error) {
    const result = { token: null, error: error as Error }
    failedRequests.forEach((request) => request.reject(result))
    return result
  } finally {
    isRefreshing = false
    failedRequests = []
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const authMethod = async (username: string, password: string): Promise<ApiResponse<AuthData>> => {
  try {
    await delay()

    const response = await myFetch('auth.json', {
      // method: 'POST'
      // headers: {
      //   'Content-Type': 'application/json'
      // }
      // body: JSON.stringify({
      //   username,
      //   password
      // })
    })

    if (!response.ok) {
      return { data: null, error: new Error('Ошибка авторизации') }
    }
    const data = await response.json()

    return { data, error: null }
  } catch (e) {
    console.error(e)
    return { data: null, error: e as Error }
  }
}

export const login = authMethod
export const signup = authMethod
