import { describe, it, expect } from 'vitest'
import { transitionsProvider } from './transitions'

describe('transitionsProvider.getOne', () => {
  it('returns available transitions for an issue', async () => {
    const result = await transitionsProvider.getOne('issue-transitions', { id: 'TEST-1' })
    expect(result.data.id).toBe('TEST-1')
    expect(result.data.transitions).toHaveLength(3)
    expect(result.data.transitions[0]).toMatchObject({ id: '11', name: 'To Do' })
  })
})

describe('transitionsProvider.update', () => {
  it('posts transition and returns updated record', async () => {
    const result = await transitionsProvider.update('issue-transitions', {
      id: 'TEST-1',
      data: { transition: { id: '21' } },
      previousData: { id: 'TEST-1' },
    })
    expect(result.data.id).toBe('TEST-1')
  })
})
