import type {
  GetListParams,
  GetListResult,
  GetOneParams,
  GetOneResult,
  CreateParams,
  CreateResult,
  UpdateParams,
  UpdateResult,
  GetManyParams,
  GetManyResult,
} from 'react-admin'
import { httpClient } from './httpClient'
import type { JiraIssue, JiraSearchResult } from '@/types/jira'

const CORE = '/jira-api/rest/api/2'

const ISSUE_FIELDS = [
  'summary', 'description', 'status', 'priority', 'issuetype',
  'assignee', 'reporter', 'project', 'created', 'updated',
  'comment', 'labels', 'fixVersions', 'duedate',
].join(',')

const toRecord = (issue: JiraIssue) => ({ ...issue, id: issue.key })

const buildJql = (filter: Record<string, unknown>, sort: { field: string; order: string }): string => {
  const conditions: string[] = []

  if (typeof filter['jql'] === 'string' && filter['jql']) {
    return `${filter['jql']} ORDER BY ${sort.field} ${sort.order}`
  }

  if (typeof filter['project'] === 'string' && filter['project']) {
    conditions.push(`project=${filter['project']}`)
  }
  if (typeof filter['status'] === 'string' && filter['status']) {
    conditions.push(`status="${filter['status']}"`)
  }
  if (typeof filter['assignee'] === 'string' && filter['assignee']) {
    conditions.push(`assignee="${filter['assignee']}"`)
  }
  if (typeof filter['priority'] === 'string' && filter['priority']) {
    conditions.push(`priority="${filter['priority']}"`)
  }
  if (typeof filter['q'] === 'string' && filter['q']) {
    conditions.push(`text ~ "${filter['q']}"`)
  }

  const where = conditions.length > 0 ? conditions.join(' AND ') : undefined
  const orderBy = `ORDER BY ${sort.field} ${sort.order}`
  return where ? `${where} ${orderBy}` : orderBy
}

export const issuesProvider = {
  async getList(_resource: string, params: GetListParams): Promise<GetListResult> {
    const { page, perPage } = params.pagination
    const startAt = (page - 1) * perPage
    const jql = buildJql(params.filter as Record<string, unknown>, params.sort)

    const { data } = await httpClient.get<JiraSearchResult>(`${CORE}/search`, {
      params: { jql, startAt, maxResults: perPage, fields: ISSUE_FIELDS },
    })

    return { data: data.issues.map(toRecord), total: data.total }
  },

  async getOne(_resource: string, params: GetOneParams): Promise<GetOneResult> {
    const { data } = await httpClient.get<JiraIssue>(`${CORE}/issue/${params.id}`, {
      params: { fields: ISSUE_FIELDS },
    })
    return { data: toRecord(data) }
  },

  async getMany(_resource: string, params: GetManyParams): Promise<GetManyResult> {
    const results = await Promise.all(
      params.ids.map((id) =>
        httpClient
          .get<JiraIssue>(`${CORE}/issue/${id}`, { params: { fields: ISSUE_FIELDS } })
          .then(({ data }) => toRecord(data))
      )
    )
    return { data: results }
  },

  async create(_resource: string, params: CreateParams): Promise<CreateResult> {
    const { data } = await httpClient.post<JiraIssue & { key: string }>(`${CORE}/issue`, params.data)
    return { data: { ...params.data, ...data, id: data.key } }
  },

  async update(_resource: string, params: UpdateParams): Promise<UpdateResult> {
    await httpClient.put(`${CORE}/issue/${params.id}`, params.data)
    return { data: { ...params.previousData, ...params.data, id: params.id } }
  },
}
