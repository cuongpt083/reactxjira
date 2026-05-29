import { Admin, Resource } from 'react-admin'
import { lightTheme } from '@/theme/linear'
import { jiraDataProvider } from '@/dataProvider'
import { jiraAuthProvider } from '@/authProvider'
import { LoginPage } from '@/authProvider/LoginPage'
import { IssueList } from '@/resources/issues/IssueList'
import { IssueShow } from '@/resources/issues/IssueShow'
import { IssueCreate } from '@/resources/issues/IssueCreate'
import { ProjectList } from '@/resources/projects/ProjectList'
import { ProjectShow } from '@/resources/projects/ProjectShow'

export const App = () => (
  <Admin
    dataProvider={jiraDataProvider}
    authProvider={jiraAuthProvider}
    loginPage={LoginPage}
    theme={lightTheme}
    title="ReactxJira"
    requireAuth
  >
    <Resource
      name="issues"
      list={IssueList}
      show={IssueShow}
      create={IssueCreate}
      recordRepresentation={(r) => r.key as string}
    />
    <Resource
      name="projects"
      list={ProjectList}
      show={ProjectShow}
      recordRepresentation={(r) => r.name as string}
    />
  </Admin>
)
