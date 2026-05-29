import { describe, it, expect } from 'vitest'
import { commentsProvider } from './comments'

describe('commentsProvider.create', () => {
  it('posts comment and returns created comment with id', async () => {
    const result = await commentsProvider.create('issue-comments', {
      data: { issueKey: 'TEST-1', body: 'Hello from test' },
    })
    expect(result.data.id).toBeDefined()
    expect(result.data.body).toBe('Hello from test')
  })
})
