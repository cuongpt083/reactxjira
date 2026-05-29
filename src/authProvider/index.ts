import type { AuthProvider } from 'react-admin'
import {
  httpClient,
  setAuthInStorage,
  clearAuthFromStorage,
  getAuthFromStorage,
  STORAGE_KEY,
} from '@/dataProvider/httpClient'
import type { JiraUser } from '@/types/jira'

interface StoredAuth {
  jiraUrl: string
  token: string
  user?: JiraUser
}

export const jiraAuthProvider: AuthProvider = {
  async login({ jiraUrl, token }: { jiraUrl: string; token: string }) {
    setAuthInStorage({ jiraUrl, token })
    try {
      const { data: user } = await httpClient.get<JiraUser>('/jira-api/rest/api/2/myself')
      const full: StoredAuth = { jiraUrl, token, user }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(full))
    } catch {
      clearAuthFromStorage()
      throw new Error('Invalid Jira URL or token. Please check your credentials.')
    }
  },

  async logout() {
    clearAuthFromStorage()
  },

  async checkAuth(_params: unknown) {
    const auth = getAuthFromStorage()
    if (!auth?.token) throw new Error('Not authenticated')
  },

  async checkError({ status }: { status?: number }) {
    if (status === 401 || status === 403) {
      clearAuthFromStorage()
      throw new Error('Session expired')
    }
  },

  async getIdentity() {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { id: '', fullName: 'Unknown', avatar: undefined }
    try {
      const { user } = JSON.parse(raw) as StoredAuth
      if (!user) return { id: '', fullName: 'Unknown', avatar: undefined }
      return {
        id: user.key,
        fullName: user.displayName,
        avatar: user.avatarUrls?.['48x48'],
      }
    } catch {
      return { id: '', fullName: 'Unknown', avatar: undefined }
    }
  },

  async getPermissions() {
    return null
  },
}
