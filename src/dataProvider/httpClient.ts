import axios from 'axios'

export const STORAGE_KEY = 'rxjira_auth'

export interface AuthCredentials {
  jiraUrl: string
  token: string
}

export const getAuthFromStorage = (): AuthCredentials | null => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthCredentials
  } catch {
    return null
  }
}

export const setAuthInStorage = (creds: AuthCredentials): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(creds))
}

export const clearAuthFromStorage = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}

export const httpClient = axios.create({ baseURL: '/' })

httpClient.interceptors.request.use((config) => {
  const auth = getAuthFromStorage()
  if (auth?.token) {
    config.headers['Authorization'] = `Bearer ${auth.token}`
  }
  return config
})
