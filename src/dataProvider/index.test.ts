import { describe, it, expect } from 'vitest'
import { jiraDataProvider } from './index'
import { issueSearchFixture, projectsFixture } from '../mocks/fixtures'

const defaultListParams = {
  pagination: { page: 1, perPage: 50 },
  sort: { field: 'updated', order: 'DESC' as const },
  filter: {},
}

describe('jiraDataProvider — issues resource', () => {
  it('getList routes to issuesProvider', async () => {
    const result = await jiraDataProvider.getList('issues', defaultListParams)
    expect(result.total).toBe(issueSearchFixture.total)
  })

  it('getOne routes to issuesProvider', async () => {
    const result = await jiraDataProvider.getOne('issues', { id: 'TEST-1' })
    expect(result.data.id).toBe('TEST-1')
  })

  it('getMany routes to issuesProvider', async () => {
    const result = await jiraDataProvider.getMany('issues', { ids: ['TEST-1'] })
    expect(result.data).toHaveLength(1)
  })

  it('create routes to issuesProvider', async () => {
    const result = await jiraDataProvider.create('issues', {
      data: { fields: { summary: 'New', project: { key: 'TEST' }, issuetype: { name: 'Story' } } },
    })
    expect(result.data.id).toBeDefined()
  })

  it('update routes to issuesProvider', async () => {
    const result = await jiraDataProvider.update('issues', {
      id: 'TEST-1',
      data: { fields: { summary: 'Updated' } },
      previousData: { id: 'TEST-1' },
    })
    expect(result.data.id).toBe('TEST-1')
  })
})

describe('jiraDataProvider — projects resource', () => {
  it('getList routes to projectsProvider', async () => {
    const result = await jiraDataProvider.getList('projects', defaultListParams)
    expect(result.data).toHaveLength(projectsFixture.length)
  })

  it('getOne routes to projectsProvider', async () => {
    const result = await jiraDataProvider.getOne('projects', { id: 'TEST' })
    expect(result.data.key).toBe('TEST')
  })
})

describe('jiraDataProvider — issue-transitions resource', () => {
  it('getOne routes to transitionsProvider', async () => {
    const result = await jiraDataProvider.getOne('issue-transitions', { id: 'TEST-1' })
    expect(result.data.id).toBe('TEST-1')
    expect(result.data.transitions).toBeDefined()
  })

  it('update routes to transitionsProvider', async () => {
    const result = await jiraDataProvider.update('issue-transitions', {
      id: 'TEST-1',
      data: { transition: { id: '21' } },
      previousData: { id: 'TEST-1' },
    })
    expect(result.data.id).toBe('TEST-1')
  })
})

describe('jiraDataProvider — issue-comments resource', () => {
  it('create routes to commentsProvider', async () => {
    const result = await jiraDataProvider.create('issue-comments', {
      data: { issueKey: 'TEST-1', body: 'Test comment' },
    })
    expect(result.data.id).toBeDefined()
  })
})

describe('jiraDataProvider — unimplemented methods throw', () => {
  it('getManyReference throws', () => {
    expect(() =>
      jiraDataProvider.getManyReference('issues', {
        id: '1', target: 'parent', pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'ASC' }, filter: {},
      })
    ).toThrow('not implemented')
  })

  it('updateMany throws', () => {
    expect(() => jiraDataProvider.updateMany('issues', { ids: ['1'], data: {} })).toThrow(
      'not implemented'
    )
  })

  it('delete throws', () => {
    expect(() =>
      jiraDataProvider.delete('issues', { id: '1', previousData: { id: '1' } })
    ).toThrow('not implemented')
  })

  it('deleteMany throws', () => {
    expect(() => jiraDataProvider.deleteMany('issues', { ids: ['1'] })).toThrow('not implemented')
  })

  it('getList for unknown resource throws', () => {
    expect(() => jiraDataProvider.getList('unknown', defaultListParams)).toThrow('not implemented')
  })

  it('getOne for unknown resource throws', () => {
    expect(() => jiraDataProvider.getOne('unknown', { id: '1' })).toThrow('not implemented')
  })

  it('getMany for unknown resource throws', () => {
    expect(() => jiraDataProvider.getMany('unknown', { ids: ['1'] })).toThrow('not implemented')
  })

  it('create for unknown resource throws', () => {
    expect(() => jiraDataProvider.create('unknown', { data: {} })).toThrow('not implemented')
  })

  it('update for unknown resource throws', () => {
    expect(() =>
      jiraDataProvider.update('unknown', { id: '1', data: {}, previousData: { id: '1' } })
    ).toThrow('not implemented')
  })
})
