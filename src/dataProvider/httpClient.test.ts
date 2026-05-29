import { describe, it, expect, afterEach, vi } from 'vitest'
import { httpClient, getAuthFromStorage, STORAGE_KEY, setAuthInStorage, clearAuthFromStorage } from './httpClient'

describe('getAuthFromStorage', () => {
  afterEach(() => localStorage.clear())

  it('returns null when storage is empty', () => {
    expect(getAuthFromStorage()).toBeNull()
  })

  it('returns parsed credentials when set', () => {
    const creds = { jiraUrl: 'http://jira.example.com', token: 'abc123' }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(creds))
    expect(getAuthFromStorage()).toEqual(creds)
  })

  it('returns null when storage contains invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json')
    expect(getAuthFromStorage()).toBeNull()
  })
})

describe('setAuthInStorage', () => {
  afterEach(() => localStorage.clear())

  it('stores credentials in localStorage', () => {
    setAuthInStorage({ jiraUrl: 'http://jira.example.com', token: 'tok' })
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    expect(stored).toEqual({ jiraUrl: 'http://jira.example.com', token: 'tok' })
  })
})

describe('clearAuthFromStorage', () => {
  afterEach(() => localStorage.clear())

  it('removes credentials from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: 'tok' }))
    clearAuthFromStorage()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})

describe('httpClient interceptors', () => {
  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('attaches Authorization header when token is present', async () => {
    setAuthInStorage({ jiraUrl: 'http://jira.example.com', token: 'my-pat-token' })
    const response = await httpClient.get('/jira-api/rest/api/2/myself')
    expect(response.config.headers['Authorization']).toBe('Bearer my-pat-token')
  })

  it('sends request without Authorization header when no token stored', async () => {
    const response = await httpClient.get('/jira-api/rest/api/2/myself')
    expect(response.config.headers['Authorization']).toBeUndefined()
  })
})
