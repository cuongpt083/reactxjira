export interface JiraUser {
  key: string
  name: string
  displayName: string
  emailAddress: string
  avatarUrls: Record<string, string>
  active: boolean
}

export interface JiraStatusCategory {
  id: number
  key: string
  colorName: string
  name: string
}

export interface JiraStatus {
  id: string
  name: string
  statusCategory: JiraStatusCategory
}

export interface JiraPriority {
  id: string
  name: string
  iconUrl: string
}

export interface JiraIssueType {
  id: string
  name: string
  iconUrl: string
  subtask: boolean
}

export interface JiraProject {
  id: string
  key: string
  name: string
  projectTypeKey?: string
  lead?: JiraUser
  description?: string
}

export interface JiraComment {
  id: string
  author: JiraUser
  body: string
  created: string
  updated: string
}

export interface JiraIssueFields {
  summary: string
  description?: string | null
  status: JiraStatus
  priority: JiraPriority
  issuetype: JiraIssueType
  assignee?: JiraUser | null
  reporter?: JiraUser | null
  project: JiraProject
  created: string
  updated: string
  comment: {
    comments: JiraComment[]
    total: number
  }
  duedate?: string | null
  fixVersions?: Array<{ id: string; name: string }>
  labels?: string[]
}

export interface JiraIssue {
  id: string
  key: string
  self: string
  fields: JiraIssueFields
}

export interface JiraSearchResult {
  issues: JiraIssue[]
  total: number
  startAt: number
  maxResults: number
}

export interface JiraTransition {
  id: string
  name: string
  to?: JiraStatus
}

export interface JiraBoard {
  id: number
  name: string
  type: 'scrum' | 'kanban'
}

export interface JiraSprint {
  id: number
  name: string
  state: 'active' | 'closed' | 'future'
  startDate?: string
  endDate?: string
  goal?: string
}
