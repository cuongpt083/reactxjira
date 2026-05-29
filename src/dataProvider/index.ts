import type { DataProvider } from 'react-admin'
import { issuesProvider } from './issues'
import { projectsProvider } from './projects'
import { transitionsProvider } from './transitions'
import { commentsProvider } from './comments'

const notImplemented = (method: string) => () => {
  throw new Error(`DataProvider.${method} not implemented`)
}

export const jiraDataProvider: DataProvider = {
  getList: (resource, params) => {
    if (resource === 'issues') return issuesProvider.getList(resource, params)
    if (resource === 'projects') return projectsProvider.getList(resource, params)
    return notImplemented('getList')()
  },

  getOne: (resource, params) => {
    if (resource === 'issues') return issuesProvider.getOne(resource, params)
    if (resource === 'projects') return projectsProvider.getOne(resource, params)
    if (resource === 'issue-transitions') return transitionsProvider.getOne(resource, params)
    return notImplemented('getOne')()
  },

  getMany: (resource, params) => {
    if (resource === 'issues') return issuesProvider.getMany(resource, params)
    return notImplemented('getMany')()
  },

  getManyReference: notImplemented('getManyReference'),

  create: (resource, params) => {
    if (resource === 'issues') return issuesProvider.create(resource, params)
    if (resource === 'issue-comments') return commentsProvider.create(resource, params)
    return notImplemented('create')()
  },

  update: (resource, params) => {
    if (resource === 'issues') return issuesProvider.update(resource, params)
    if (resource === 'issue-transitions') return transitionsProvider.update(resource, params)
    return notImplemented('update')()
  },

  updateMany: notImplemented('updateMany'),

  delete: notImplemented('delete'),

  deleteMany: notImplemented('deleteMany'),
}
