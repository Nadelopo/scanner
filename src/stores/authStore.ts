import { readonly, ref } from 'vue'
import { defineStore } from 'pinia'
import { openDB } from 'idb'
import { login as LogIn, signup as SignUp, getAccessToken } from '../api/services/auth'

export const useAuthStore = defineStore('auth', () => {
  const isAuth = ref(false)

  const setAuth = async (access: string) => {
    const db = await openDB('app-db', 1)
    isAuth.value = true
    await db.put('auth', { id: 1, token: access })
  }

  const login = async (username: string, password: string) => {
    const { error, data } = await LogIn(username, password)
    if (error) return
    setAuth(data.accessToken)
    return true
  }

  const signup = async (username: string, password: string) => {
    const { error, data } = await SignUp(username, password)
    if (error) return
    setAuth(data.accessToken)
    return true
  }

  const checkToken = async (): Promise<boolean> => {
    const access = await getAccessToken()
    if (!access) return false

    const isValid = true // isTokenExpired(access)

    if (isValid) {
      isAuth.value = true
      return true
    }

    await logout()
    return false
  }

  const logout = async () => {
    isAuth.value = false
    const db = await openDB('app-db', 1)
    await db.delete('auth', 1)
  }

  return { login, logout, checkToken, signup, isAuth: readonly(isAuth) }
})
