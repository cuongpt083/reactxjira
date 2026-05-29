export const myselfFixture = {
  key: 'testuser',
  name: 'testuser',
  displayName: 'Test User',
  emailAddress: 'test@example.com',
  avatarUrls: { '48x48': 'https://example.com/avatar.png' },
  active: true,
}

export const issueFixture = {
  id: '10000',
  key: 'TEST-1',
  self: 'http://localhost:8080/rest/api/2/issue/10000',
  fields: {
    summary: 'Test issue summary',
    description: 'Test issue description',
    status: {
      id: '10001',
      name: 'In Progress',
      statusCategory: { id: 4, key: 'indeterminate', colorName: 'yellow', name: 'In Progress' },
    },
    priority: { id: '3', name: 'Medium', iconUrl: '' },
    issuetype: { id: '10001', name: 'Story', iconUrl: '', subtask: false },
    assignee: myselfFixture,
    reporter: myselfFixture,
    project: { id: '10000', key: 'TEST', name: 'Test Project' },
    created: '2024-01-01T00:00:00.000+0000',
    updated: '2024-01-15T00:00:00.000+0000',
    comment: {
      comments: [
        {
          id: '10000',
          author: myselfFixture,
          body: 'Test comment',
          created: '2024-01-10T00:00:00.000+0000',
          updated: '2024-01-10T00:00:00.000+0000',
        },
      ],
      total: 1,
    },
  },
}

export const issueSearchFixture = {
  issues: [
    issueFixture,
    {
      ...issueFixture,
      id: '10001',
      key: 'TEST-2',
      fields: {
        ...issueFixture.fields,
        summary: 'Second test issue',
        status: {
          id: '10000',
          name: 'To Do',
          statusCategory: { id: 2, key: 'new', colorName: 'blue-gray', name: 'To Do' },
        },
      },
    },
  ],
  total: 2,
  startAt: 0,
  maxResults: 50,
}

export const projectsFixture = [
  {
    id: '10000',
    key: 'TEST',
    name: 'Test Project',
    projectTypeKey: 'software',
    lead: myselfFixture,
    description: 'Test project description',
  },
  {
    id: '10001',
    key: 'DEMO',
    name: 'Demo Project',
    projectTypeKey: 'software',
    lead: myselfFixture,
    description: 'Demo project description',
  },
]
