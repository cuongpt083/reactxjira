import { http, HttpResponse } from 'msw'
import { myselfFixture, issueSearchFixture, issueFixture, projectsFixture } from './fixtures'

const BASE = '/jira-api/rest/api/2'
const AGILE = '/jira-api/rest/agile/1.0'

export const handlers = [
  http.get(`${BASE}/myself`, ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (auth === 'Bearer invalid-token') {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    return HttpResponse.json(myselfFixture)
  }),

  http.get(`${BASE}/search`, ({ request }) => {
    const url = new URL(request.url)
    const jql = url.searchParams.get('jql') ?? ''
    if (jql.includes('project=')) {
      const key = jql.match(/project=(\w+)/)?.[1]
      const filtered = issueSearchFixture.issues.filter(
        (i) => i.fields.project.key === key
      )
      return HttpResponse.json({ ...issueSearchFixture, issues: filtered, total: filtered.length })
    }
    return HttpResponse.json(issueSearchFixture)
  }),

  http.get(`${BASE}/issue/:key`, ({ params }) =>
    HttpResponse.json({ ...issueFixture, key: params['key'] as string })
  ),

  http.get(`${BASE}/issue/:key/transitions`, () =>
    HttpResponse.json({
      transitions: [
        { id: '11', name: 'To Do' },
        { id: '21', name: 'In Progress' },
        { id: '31', name: 'Done' },
      ],
    })
  ),

  http.post(`${BASE}/issue/:key/transitions`, () => new HttpResponse(null, { status: 204 })),

  http.get(`${BASE}/issue/:key/comment`, () =>
    HttpResponse.json({ comments: issueFixture.fields.comment.comments, total: 1 })
  ),

  http.post(`${BASE}/issue/:key/comment`, async ({ request }) => {
    const body = await request.json() as { body: string }
    return HttpResponse.json({ id: '10001', body: body.body }, { status: 201 })
  }),

  http.post(`${BASE}/issue`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: '10001', key: 'TEST-99', self: '', ...body }, { status: 201 })
  }),

  http.put(`${BASE}/issue/:key`, () => new HttpResponse(null, { status: 204 })),

  http.get(`${BASE}/project`, () => HttpResponse.json(projectsFixture)),

  http.get(`${BASE}/project/:key`, ({ params }) =>
    HttpResponse.json(projectsFixture.find((p) => p.key === params['key']) ?? projectsFixture[0])
  ),

  http.get(`${AGILE}/board`, () =>
    HttpResponse.json({ values: [{ id: 1, name: 'Test Board', type: 'scrum' }], total: 1 })
  ),
]
