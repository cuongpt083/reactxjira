import type {
  GetListParams,
  GetListResult,
  GetOneParams,
  GetOneResult,
} from 'react-admin'
import { httpClient } from './httpClient'
import type { JiraProject } from '@/types/jira'

const CORE = '/jira-api/rest/api/2'

const toRecord = (project: JiraProject) => ({ ...project, id: project.id })

export const projectsProvider = {
  async getList(_resource: string, _params: GetListParams): Promise<GetListResult> {
    const { data } = await httpClient.get<JiraProject[]>(`${CORE}/project`)
    if (!Array.isArray(data)) {
      return { data: [], total: 0 }
    }
    return { data: data.map(toRecord), total: data.length }
  },

  async getOne(_resource: string, params: GetOneParams): Promise<GetOneResult> {
    const { data } = await httpClient.get<JiraProject>(`${CORE}/project/${params.id}`)
    return { data: toRecord(data) }
  },
}
