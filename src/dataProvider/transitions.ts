import type { GetOneParams, GetOneResult, UpdateParams, UpdateResult } from 'react-admin'
import { httpClient } from './httpClient'
import type { JiraTransition } from '@/types/jira'

const CORE = '/jira-api/rest/api/2'

export const transitionsProvider = {
  async getOne(_resource: string, params: GetOneParams): Promise<GetOneResult> {
    const { data } = await httpClient.get<{ transitions: JiraTransition[] }>(
      `${CORE}/issue/${params.id}/transitions`
    )
    return { data: { id: params.id, transitions: data.transitions } }
  },

  async update(_resource: string, params: UpdateParams): Promise<UpdateResult> {
    await httpClient.post(`${CORE}/issue/${params.id}/transitions`, params.data)
    return { data: { id: params.id, ...params.data } }
  },
}
