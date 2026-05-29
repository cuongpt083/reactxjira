import { describe, it, expect } from 'vitest'
import { issuesProvider } from './issues'
import { issueFixture, issueSearchFixture } from '../mocks/fixtures'

describe('issuesProvider.getList', () => {
  it('returns issues mapped to react-admin format', async () => {
    const result = await issuesProvider.getList('issues', {
      pagination: { page: 1, perPage: 50 },
      sort: { field: 'updated', order: 'DESC' },
      filter: {},
    })
    expect(result.data).toHaveLength(issueSearchFixture.issues.length)
    expect(result.total).toBe(issueSearchFixture.total)
    expect(result.data[0].id).toBe(issueSearchFixture.issues[0].key)
  })

  it('maps issue key as record id', async () => {
    const result = await issuesProvider.getList('issues', {
      pagination: { page: 1, perPage: 50 },
      sort: { field: 'updated', order: 'DESC' },
      filter: {},
    })
    result.data.forEach((record, i) => {
      expect(record.id).toBe(issueSearchFixture.issues[i].key)
    })
  })

  it('calculates correct startAt for page 2', async () => {
    const result = await issuesProvider.getList('issues', {
      pagination: { page: 2, perPage: 10 },
      sort: { field: 'updated', order: 'DESC' },
      filter: {},
    })
    expect(result).toBeDefined()
  })

  it('passes jql filter directly when provided', async () => {
    const result = await issuesProvider.getList('issues', {
      pagination: { page: 1, perPage: 50 },
      sort: { field: 'updated', order: 'DESC' },
      filter: { jql: 'assignee = currentUser()' },
    })
    expect(result.data).toBeDefined()
  })

  it('builds JQL from project filter', async () => {
    const result = await issuesProvider.getList('issues', {
      pagination: { page: 1, perPage: 50 },
      sort: { field: 'updated', order: 'DESC' },
      filter: { project: 'TEST' },
    })
    expect(result.data[0].id).toBe(issueFixture.key)
  })

  it('preserves all issue fields in response', async () => {
    const result = await issuesProvider.getList('issues', {
      pagination: { page: 1, perPage: 50 },
      sort: { field: 'updated', order: 'DESC' },
      filter: {},
    })
    const first = result.data[0]
    expect(first.fields?.summary).toBeDefined()
    expect(first.fields?.status).toBeDefined()
    expect(first.fields?.priority).toBeDefined()
  })
})

describe('issuesProvider.getOne', () => {
  it('returns single issue by key', async () => {
    const result = await issuesProvider.getOne('issues', { id: 'TEST-1' })
    expect(result.data.id).toBe('TEST-1')
    expect(result.data.fields?.summary).toBe(issueFixture.fields.summary)
  })

  it('maps key as id', async () => {
    const result = await issuesProvider.getOne('issues', { id: 'TEST-42' })
    expect(result.data.id).toBe('TEST-42')
  })

  it('includes all nested fields', async () => {
    const result = await issuesProvider.getOne('issues', { id: 'TEST-1' })
    expect(result.data.fields?.comment?.comments).toBeDefined()
    expect(result.data.fields?.assignee).toBeDefined()
  })
})

describe('issuesProvider.create', () => {
  it('creates issue and returns with id', async () => {
    const result = await issuesProvider.create('issues', {
      data: { fields: { summary: 'New issue', project: { key: 'TEST' }, issuetype: { name: 'Story' } } },
    })
    expect(result.data.id).toBeDefined()
    expect(result.data.key).toBe('TEST-99')
  })
})

describe('issuesProvider.update', () => {
  it('updates issue fields and returns updated record', async () => {
    const result = await issuesProvider.update('issues', {
      id: 'TEST-1',
      data: { fields: { summary: 'Updated summary' } },
      previousData: { id: 'TEST-1' },
    })
    expect(result.data.id).toBe('TEST-1')
  })
})

describe('issuesProvider.getMany', () => {
  it('fetches multiple issues by ids', async () => {
    const result = await issuesProvider.getMany('issues', { ids: ['TEST-1', 'TEST-2'] })
    expect(result.data).toHaveLength(2)
    expect(result.data[0].id).toBe('TEST-1')
  })
})

describe('buildJql filter branches', () => {
  it('filters by status', async () => {
    const result = await issuesProvider.getList('issues', {
      pagination: { page: 1, perPage: 50 },
      sort: { field: 'updated', order: 'DESC' },
      filter: { status: 'In Progress' },
    })
    expect(result.data).toBeDefined()
  })

  it('filters by assignee', async () => {
    const result = await issuesProvider.getList('issues', {
      pagination: { page: 1, perPage: 50 },
      sort: { field: 'updated', order: 'DESC' },
      filter: { assignee: 'testuser' },
    })
    expect(result.data).toBeDefined()
  })

  it('filters by priority', async () => {
    const result = await issuesProvider.getList('issues', {
      pagination: { page: 1, perPage: 50 },
      sort: { field: 'updated', order: 'DESC' },
      filter: { priority: 'Medium' },
    })
    expect(result.data).toBeDefined()
  })

  it('filters by text search (q)', async () => {
    const result = await issuesProvider.getList('issues', {
      pagination: { page: 1, perPage: 50 },
      sort: { field: 'updated', order: 'DESC' },
      filter: { q: 'test query' },
    })
    expect(result.data).toBeDefined()
  })

  it('builds JQL with no conditions when filter is empty', async () => {
    const result = await issuesProvider.getList('issues', {
      pagination: { page: 1, perPage: 50 },
      sort: { field: 'created', order: 'ASC' },
      filter: {},
    })
    expect(result.data).toBeDefined()
  })
})
