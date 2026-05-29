import { describe, it, expect, afterEach } from 'vitest'
import { jiraAuthProvider } from './index'
import { setAuthInStorage, STORAGE_KEY } from '@/dataProvider/httpClient'

// react-admin AuthProvider: logout/getPermissions require a param; getIdentity is optional
const logout = () => jiraAuthProvider.logout({})
const getIdentity = () => jiraAuthProvider.getIdentity!()
const getPermissions = () => jiraAuthProvider.getPermissions!({})

describe('jiraAuthProvider.login', () => {
  afterEach(() => localStorage.clear())

  it('stores credentials and returns user on valid PAT', async () => {
    await expect(
      jiraAuthProvider.login({ jiraUrl: 'http://localhost', token: 'valid-token' })
    ).resolves.toBeUndefined()
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    expect(stored.token).toBe('valid-token')
    expect(stored.user).toBeDefined()
    expect(stored.user.displayName).toBe('Test User')
  })

  it('rejects with error message on 401 response', async () => {
    await expect(
      jiraAuthProvider.login({ jiraUrl: 'http://localhost', token: 'invalid-token' })
    ).rejects.toThrow()
  })
})

describe('jiraAuthProvider.logout', () => {
  afterEach(() => localStorage.clear())

  it('clears credentials from storage', async () => {
    setAuthInStorage({ jiraUrl: 'http://localhost', token: 'tok' })
    await logout()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('resolves when storage is already empty', async () => {
    await expect(logout()).resolves.toBeUndefined()
  })
})

describe('jiraAuthProvider.checkAuth', () => {
  afterEach(() => localStorage.clear())

  it('resolves when valid credentials are stored', async () => {
    setAuthInStorage({ jiraUrl: 'http://localhost', token: 'tok' })
    await expect(jiraAuthProvider.checkAuth({})).resolves.toBeUndefined()
  })

  it('rejects when no credentials stored', async () => {
    await expect(jiraAuthProvider.checkAuth({})).rejects.toThrow()
  })
})

describe('jiraAuthProvider.checkError', () => {
  afterEach(() => localStorage.clear())

  it('rejects on 401 status', async () => {
    await expect(jiraAuthProvider.checkError({ status: 401 })).rejects.toThrow()
  })

  it('rejects on 403 status', async () => {
    await expect(jiraAuthProvider.checkError({ status: 403 })).rejects.toThrow()
  })

  it('resolves on other error statuses', async () => {
    await expect(jiraAuthProvider.checkError({ status: 500 })).resolves.toBeUndefined()
  })

  it('resolves when no status provided', async () => {
    await expect(jiraAuthProvider.checkError({})).resolves.toBeUndefined()
  })
})

describe('jiraAuthProvider.getIdentity', () => {
  afterEach(() => localStorage.clear())

  it('returns identity from stored user', async () => {
    const stored = {
      jiraUrl: 'http://localhost',
      token: 'tok',
      user: { key: 'testuser', displayName: 'Test User', avatarUrls: { '48x48': 'http://avatar' } },
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
    const identity = await getIdentity()
    expect(identity.id).toBe('testuser')
    expect(identity.fullName).toBe('Test User')
    expect(identity.avatar).toBe('http://avatar')
  })

  it('returns empty identity when no user stored', async () => {
    const identity = await getIdentity()
    expect(identity.id).toBe('')
    expect(identity.fullName).toBe('Unknown')
  })
})

describe('jiraAuthProvider.getIdentity — edge cases', () => {
  afterEach(() => localStorage.clear())

  it('returns empty identity when localStorage contains invalid JSON', async () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-json')
    const identity = await getIdentity()
    expect(identity.id).toBe('')
    expect(identity.fullName).toBe('Unknown')
  })

  it('returns empty identity when stored auth has no user field', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ jiraUrl: 'http://x', token: 't' }))
    const identity = await getIdentity()
    expect(identity.id).toBe('')
    expect(identity.fullName).toBe('Unknown')
  })
})

describe('jiraAuthProvider.getPermissions', () => {
  it('resolves with null', async () => {
    await expect(getPermissions()).resolves.toBeNull()
  })
})
