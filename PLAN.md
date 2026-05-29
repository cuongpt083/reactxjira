# reactxjira — Implementation Plan

## Project Summary

PWA thay thế UI của Jira Datacenter v11. Cung cấp giao diện Linear-inspired, mobile-friendly, cho internal tech team. Kết nối trực tiếp Jira DC REST API, không cần backend riêng.

- **Success criteria**: Team adopt >80% thay thế Jira UI trong daily workflow
- **Solo dev**: BA/Architect, React/TS beginner, 100% AI-assisted, 15 giờ/tuần
- **Timeline**: MVP1 (tuần 1) → MVP2 (tuần 2–3) → v1.0 (tháng 2)

---

## Tech Stack

| Layer | Technology | Lý do |
|-------|-----------|-------|
| Framework | **react-admin v5** | CRUD scaffold, routing, auth, data-fetching đóng gói sẵn |
| Build | Vite + React 18 + TypeScript (strict) | Fast DX, ecosystem tốt |
| Routing | react-router v6/v7 (bundled via react-admin) | Không cần cài riêng |
| Data | TanStack Query v5 (bundled via react-admin) | Không cần cài riêng |
| UI | MUI v7 (bundled via react-admin) | Custom Linear theme override trên nền react-admin |
| Forms | react-hook-form (bundled via react-admin) | Không cần cài riêng |
| Mobile | PWA (vite-plugin-pwa) | Cùng codebase, installable, không cần app store |
| HTTP | Axios | Custom httpClient cho Jira Data Provider |
| Test | Vitest + React Testing Library | TDD workflow |
| Lint | ESLint + Prettier | Code quality |

> **Note**: react-admin v5 bundle sẵn react-router, TanStack Query v5, MUI v7, react-hook-form.
> Không cài riêng các thư viện này — tránh version conflict.

---

## Architecture

### Auth Flow
```
User nhập: Jira Base URL + Personal Access Token (PAT)
  → Lưu localStorage: { jiraUrl, token }
  → Mọi request: Authorization: Bearer {PAT}
  → Verify: GET /rest/api/2/myself → hiện tên user
```

### CORS Solution
```
Development:  Vite proxy  /jira-api/* → {JIRA_BASE_URL}/*
Production:   Nginx       location /jira-api/ { proxy_pass {JIRA_BASE_URL}/; }
```

### Jira REST API Bases
```
Core API:   {base}/rest/api/2/
Agile API:  {base}/rest/agile/1.0/
```

### react-admin Architecture Pattern

react-admin chia project thành 3 loại:
1. **Resources** — màn hình CRUD standard (Issues, Projects) — react-admin generate scaffold
2. **Custom Pages** — màn hình non-CRUD (Board, Backlog, Roadmap, Dashboard) — custom React component, đăng ký qua `<CustomRoutes>`
3. **Providers** — adapter layer giữa react-admin và Jira API (DataProvider + AuthProvider)

### Folder Structure
```
src/
├── dataProvider/
│   ├── index.ts           # Jira Data Provider — implements react-admin DataProvider interface
│   ├── httpClient.ts      # Axios instance + PAT Bearer token interceptor
│   ├── issues.ts          # getList (JQL), getOne, create, update, transitions, comments
│   ├── projects.ts        # getList, getOne
│   └── boards.ts          # boards, sprints, backlog (non-standard — custom methods)
│
├── authProvider/
│   └── index.ts           # login (PAT input), logout, checkAuth, checkError
│
├── resources/             # react-admin Resource components (CRUD)
│   ├── issues/
│   │   ├── IssueList.tsx  # <List> + <Datagrid> + filters
│   │   ├── IssueShow.tsx  # <Show> + status transition buttons + comments
│   │   ├── IssueEdit.tsx  # <Edit> + <SimpleForm>
│   │   └── IssueCreate.tsx
│   └── projects/
│       ├── ProjectList.tsx
│       └── ProjectShow.tsx
│
├── pages/                 # Custom pages — non-CRUD, registered via <CustomRoutes>
│   ├── SprintBoard.tsx    # Kanban board (MVP2)
│   ├── Backlog.tsx        # Backlog + drag-to-sprint (MVP2)
│   ├── Roadmap.tsx        # Epic timeline (v1.0)
│   └── Dashboard.tsx      # My Work summary (v1.0)
│
├── components/            # Shared UI components
│   ├── StatusTransition/  # Status transition button group (dùng trong IssueShow)
│   ├── IssueCard/         # Card compact (dùng trong Board)
│   ├── PriorityIcon/
│   └── MobileNav/         # Bottom navigation bar (mobile)
│
├── theme/
│   └── linear.ts          # MUI theme override: Linear palette, typography, component defaults
│
├── types/
│   └── jira.ts            # JiraIssue, JiraSprint, JiraProject, JiraBoard...
│
└── App.tsx                # <Admin> root — khai báo Resources + CustomRoutes + theme
```

---

## Phase 1: MVP1 — "The Linear Moment"
**Duration**: Tuần 1 | **Budget**: ~15 giờ
**Goal**: Team cài app lên phone, xem & update issues không cần mở Jira

### Task 1.1 — Project Setup + react-admin Scaffold `[2h]`
- [ ] `npm create vite@latest reactxjira -- --template react-ts`
- [ ] Cài dependencies: `react-admin axios vite-plugin-pwa`
- [ ] Cài dev deps: `vitest @testing-library/react eslint prettier`
- [ ] `tsconfig.json`: strict mode, path aliases (`@/` → `src/`)
- [ ] `vite.config.ts`: proxy `/jira-api` → env var `VITE_JIRA_URL`
- [ ] Tạo folder structure theo architecture (dataProvider/, authProvider/, resources/, pages/, components/, theme/)
- [ ] `src/App.tsx`: skeleton `<Admin>` với placeholder dataProvider
- [ ] `src/theme/linear.ts`: MUI theme override (Linear palette, typography)
- [ ] ESLint + Prettier config

**Kiểm tra**: `npm run dev` → react-admin default UI chạy được, theme Linear hiển thị

> ⚠️ **Không cài riêng**: react-router, @tanstack/react-query, @mui/material, react-hook-form — đã có trong react-admin

---

### Task 1.2 — Jira Data Provider `[4h]` ← CRITICAL FOUNDATION
Đây là task quan trọng nhất. Toàn bộ project phụ thuộc vào Data Provider này.

- [ ] `src/dataProvider/httpClient.ts`:
  - Axios instance với base URL `/jira-api`
  - Interceptor: gắn `Authorization: Bearer {token}` từ localStorage
  - Interceptor: map Axios errors → react-admin `HttpError`

- [ ] `src/dataProvider/issues.ts` — implement react-admin DataProvider interface cho Issues:
  ```
  getList   → GET /rest/api/2/search?jql={filter}&fields=...&startAt={page}&maxResults={perPage}
  getOne    → GET /rest/api/2/issue/{id}
  create    → POST /rest/api/2/issue
  update    → PUT /rest/api/2/issue/{id}  (field updates)
  delete    → DELETE /rest/api/2/issue/{id}
  ```
  - Map JQL `ORDER BY` ↔ react-admin `sort`
  - Map JQL filters ↔ react-admin `filter`
  - Map Jira pagination (`startAt`, `total`) ↔ react-admin pagination

- [ ] `src/dataProvider/projects.ts`:
  ```
  getList   → GET /rest/api/2/project
  getOne    → GET /rest/api/2/project/{id}
  ```

- [ ] `src/dataProvider/index.ts`: `combineDataProviders` hoặc switch-case theo resource name

- [ ] Unit tests: `dataProvider/issues.test.ts` — mock Axios, verify mapping

**Kiểm tra**: Gọi `dataProvider.getList('issues', {...})` → trả về đúng format react-admin

**Jira API used**:
```
GET  /rest/api/2/search?jql=...&fields=...
GET  /rest/api/2/issue/{key}
POST /rest/api/2/issue
PUT  /rest/api/2/issue/{key}
GET  /rest/api/2/project
```

---

### Task 1.3 — Auth Provider (PAT) `[1h]`
- [ ] `src/authProvider/index.ts`:
  - `login({ jiraUrl, token })` → verify `GET /rest/api/2/myself` → lưu `{ jiraUrl, token, user }` vào localStorage
  - `logout()` → xóa localStorage
  - `checkAuth()` → kiểm tra localStorage có credentials không
  - `checkError({ status })` → nếu 401/403 → logout
  - `getIdentity()` → trả về `{ id, fullName, avatar }` từ localStorage user
- [ ] Custom `<LoginPage>`: form nhập Jira Base URL + PAT (thay default username/password)

**Kiểm tra**: Nhập URL + PAT sai → lỗi rõ ràng. Nhập đúng → hiện tên user trên app bar.

---

### Task 1.4 — My Issues + Issue List `[3h]`
- [ ] `src/resources/issues/IssueList.tsx`:
  - `<List>` với default filter: `jql=assignee=currentUser() ORDER BY updated DESC`
  - `<Datagrid rowClick="show">` các cột: Key, Summary, Status, Priority, Project
  - `<StatusChip>` component: màu theo status category
  - `<PriorityIcon>` component
  - Filter sidebar: Status, Priority, Project
  - Mobile: dùng `<SimpleList>` thay `<Datagrid>` khi xs breakpoint
- [ ] Đăng ký resource trong `App.tsx`: `<Resource name="issues" list={IssueList} .../>`

**Kiểm tra**: My Issues hiển thị, filter hoạt động, responsive trên mobile

---

### Task 1.5 — Issue Detail + Status Transition `[3h]`
- [ ] `src/resources/issues/IssueShow.tsx`:
  - `<Show>`: summary, description (render Jira wiki markup → HTML), status, priority, assignee, reporter, dates
  - `<StatusTransition>` component:
    - Gọi `GET /rest/api/2/issue/{key}/transitions`
    - Hiện MUI ButtonGroup với các transitions có thể thực hiện
    - Click → `POST /rest/api/2/issue/{key}/transitions { transition: { id } }`
    - Dùng react-admin `useUpdate` + custom endpoint hoặc `useDataProvider`
    - Invalidate record sau transition
  - Comments section: list comments + textarea thêm comment mới
    - `POST /rest/api/2/issue/{key}/comment` via `useCreate` hoặc `useDataProvider`

**Kiểm tra**: Mở issue → đổi status → status cập nhật ngay. Thêm comment → hiện trong list.

---

### Task 1.6 — Project List + PWA + Mobile Polish `[2h]`

**Project List**:
- [ ] `src/resources/projects/ProjectList.tsx`: `<List>` + `<Datagrid>` với project name, key, type
- [ ] `src/resources/projects/ProjectShow.tsx`: issues của project (filter JQL `project={key}`)

**PWA**:
- [ ] `vite-plugin-pwa` config trong `vite.config.ts`
- [ ] `manifest.webmanifest`: name, icons (192/512), theme_color, display: standalone
- [ ] Service worker: cache app shell

**Mobile Polish**:
- [ ] Custom react-admin `<Layout>`: thay sidebar bằng bottom navigation trên mobile (xs breakpoint)
- [ ] Touch targets ≥ 48px, tắt hover effects trên mobile
- [ ] Test trên Chrome DevTools: iPhone 12 + Android emulator

**Kiểm tra**: Cài app lên phone từ Chrome, mở standalone, dùng được My Issues + Issue Detail

---

## Phase 2: MVP2 — "Team adopts daily"
**Duration**: Tuần 2–3 | **Budget**: ~30 giờ
**Goal**: Team dùng app cho toàn bộ daily workflow

### Task 2.1 — Sprint Board `[8h]`
- [ ] Board selection nếu có nhiều boards: `GET /rest/agile/1.0/board`
- [ ] Active sprint: `GET /rest/agile/1.0/board/{id}/sprint?state=active`
- [ ] Sprint issues: `GET /rest/agile/1.0/sprint/{id}/issue`
- [ ] Kanban columns: group issues by `status.statusCategory` (To Do / In Progress / Done)
- [ ] Drag-and-drop (dnd-kit): kéo issue sang column → trigger status transition
- [ ] Issue count badge per column
- [ ] Swimlane by assignee (toggle)
- [ ] Sprint info header: name, dates, remaining days

**Kiểm tra**: Kéo issue sang "In Progress" → status thay đổi trong Jira

---

### Task 2.2 — Backlog View `[6h]`
- [ ] `GET /rest/agile/1.0/board/{id}/backlog`
- [ ] Group by: Epic (collapsed/expanded), Unassigned Epic
- [ ] Drag issue sang sprint: `POST /rest/agile/1.0/sprint/{id}/issue`
- [ ] Rank reorder (nếu Jira có ranking enabled)
- [ ] Show sprint sections (future sprints)
- [ ] Bulk select + move to sprint

---

### Task 2.3 — Quick Create Issue `[4h]`
- [ ] Keyboard shortcut: `C` key → open create modal (bất kỳ màn hình nào)
- [ ] Fields: Summary (required), Project, Issue Type, Assignee, Priority, Sprint
- [ ] Default: assign to current user, current project/sprint context
- [ ] Submit: `POST /rest/api/2/issue`
- [ ] Invalidate relevant queries sau khi tạo
- [ ] Keyboard navigation trong modal (Tab, Enter, Escape)

---

### Task 2.4 — Search + Filter `[5h]`
- [ ] Global search bar: `Cmd+K` / `Ctrl+K` → open command palette (Linear style)
- [ ] Text search: `GET /rest/api/2/search?jql=text ~ "{query}"`
- [ ] JQL input cho power users (với validation)
- [ ] Filter chips: Status / Assignee / Priority / Sprint / Project
- [ ] Saved filters (localStorage): đặt tên, lưu JQL
- [ ] Recent searches history

---

### Task 2.5 — Project Issues View `[4h]`
- [ ] `/projects/$key` → project detail
- [ ] Tab: Board view / List view
- [ ] Project metadata: description, lead, versions, components
- [ ] Issues grouped by Epic hoặc Sprint
- [ ] Project navigation trong sidebar

---

### Task 2.6 — Offline Cache `[3h]`
- [ ] Service worker: cache My Issues response (stale-while-revalidate)
- [ ] Offline indicator banner
- [ ] Disable mutations khi offline + toast "No connection"
- [ ] Background sync: queue mutations khi offline → gửi khi có mạng lại

---

## Phase 3: v1.0 — "Jira UI abandoned"
**Duration**: Tháng 2 | **Budget**: ~25 giờ
**Goal**: Adoption >80%, Jira UI chỉ dùng cho admin

### Task 3.1 — Roadmap / Timeline View `[10h]`
- [ ] Fetch Epics: `GET /rest/api/2/search?jql=project={key} AND issuetype=Epic`
- [ ] Horizontal timeline (thư viện: `@nivo/gantt` hoặc custom Canvas)
- [ ] Date range bars per Epic
- [ ] Zoom levels: Week / Month / Quarter
- [ ] Drag bar để adjust start/end date → `PUT /rest/api/2/issue/{key}` update dates
- [ ] Child issues count per Epic
- [ ] Color by status

---

### Task 3.2 — Dashboard `[8h]`
- [ ] My Work: issues by status (doughnut chart)
- [ ] Sprint progress: completed/total issues (linear progress)
- [ ] Recent activity: `GET /rest/api/2/issue/{key}?fields=changelog`
- [ ] Team workload: issues per assignee (nếu có quyền xem)
- [ ] Quick links: My Issues / Active Sprint / Backlog
- [ ] Configurable: drag-to-reorder widgets (localStorage)

---

### Task 3.3 — Dark Mode `[4h]`
- [ ] MUI theme: 2 palettes (light Linear / dark Linear)
- [ ] Toggle button trong app bar
- [ ] Save preference: localStorage
- [ ] Detect OS preference: `prefers-color-scheme`
- [ ] Smooth transition

---

### Task 3.4 — Performance `[3h]`
- [ ] Virtual list: `@tanstack/react-virtual` cho backlog lớn (>200 issues)
- [ ] Image lazy loading (avatars)
- [ ] Route-based code splitting (react-router lazy loading)
- [ ] Measure: Lighthouse score ≥ 90

---

## Quality Gates (mỗi task)

Trước khi đánh dấu task hoàn thành:
- [ ] TypeScript: `npm run typecheck` — 0 errors
- [ ] Lint: `npm run lint` — 0 warnings
- [ ] Tests: core logic có unit test (TDD)
- [ ] Mobile: test trên Chrome DevTools mobile emulator
- [ ] API errors: có error state + toast notification

---

## Key API Reference

```
# Auth
GET  /rest/api/2/myself

# Issues
GET  /rest/api/2/search?jql={jql}&fields={fields}
GET  /rest/api/2/issue/{key}
POST /rest/api/2/issue
PUT  /rest/api/2/issue/{key}
GET  /rest/api/2/issue/{key}/transitions
POST /rest/api/2/issue/{key}/transitions
GET  /rest/api/2/issue/{key}/comment
POST /rest/api/2/issue/{key}/comment

# Projects
GET  /rest/api/2/project
GET  /rest/api/2/project/{key}

# Board & Sprint (Agile API)
GET  /rest/agile/1.0/board
GET  /rest/agile/1.0/board/{id}/sprint?state=active
GET  /rest/agile/1.0/sprint/{id}/issue
POST /rest/agile/1.0/sprint/{id}/issue
GET  /rest/agile/1.0/board/{id}/backlog
GET  /rest/agile/1.0/board/{id}/epic
```
