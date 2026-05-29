import type { CreateParams, CreateResult } from 'react-admin'
import { httpClient } from './httpClient'
import type { JiraComment } from '@/types/jira'

const CORE = '/jira-api/rest/api/2'

export const commentsProvider = {
  async create(_resource: string, params: CreateParams): Promise<CreateResult> {
    const { issueKey, body } = params.data as { issueKey: string; body: string }
    const { data } = await httpClient.post<JiraComment>(
      `${CORE}/issue/${issueKey}/comment`,
      { body }
    )
    return { data: { ...data, id: data.id } }
  },
}
