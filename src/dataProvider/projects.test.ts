import { describe, it, expect } from 'vitest'
import { projectsProvider } from './projects'
import { projectsFixture } from '../mocks/fixtures'

describe('projectsProvider.getList', () => {
  it('returns all projects in react-admin format', async () => {
    const result = await projectsProvider.getList('projects', {
      pagination: { page: 1, perPage: 25 },
      sort: { field: 'name', order: 'ASC' },
      filter: {},
    })
    expect(result.data).toHaveLength(projectsFixture.length)
    expect(result.total).toBe(projectsFixture.length)
  })

  it('maps project id as record id', async () => {
    const result = await projectsProvider.getList('projects', {
      pagination: { page: 1, perPage: 25 },
      sort: { field: 'name', order: 'ASC' },
      filter: {},
    })
    result.data.forEach((record, i) => {
      expect(record.id).toBe(projectsFixture[i].id)
    })
  })

  it('preserves project fields', async () => {
    const result = await projectsProvider.getList('projects', {
      pagination: { page: 1, perPage: 25 },
      sort: { field: 'name', order: 'ASC' },
      filter: {},
    })
    expect(result.data[0].key).toBe(projectsFixture[0].key)
    expect(result.data[0].name).toBe(projectsFixture[0].name)
  })
})

describe('projectsProvider.getOne', () => {
  it('returns project by key', async () => {
    const result = await projectsProvider.getOne('projects', { id: 'TEST' })
    expect(result.data.key).toBe('TEST')
    expect(result.data.name).toBe(projectsFixture[0].name)
  })

  it('maps project id as record id', async () => {
    const result = await projectsProvider.getOne('projects', { id: 'TEST' })
    expect(result.data.id).toBe(projectsFixture[0].id)
  })
})
