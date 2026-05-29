import {
  List,
  Datagrid,
  TextField,
  DateField,
  FunctionField,
  SearchInput,
  SelectInput,
  useMediaQuery,
  SimpleList,
} from 'react-admin'
import type { Theme } from '@mui/material/styles'
import type { RaRecord } from 'react-admin'
import { StatusChip } from '@/components/StatusChip/StatusChip'
import { PriorityIcon } from '@/components/PriorityIcon/PriorityIcon'
import type { JiraIssue } from '@/types/jira'

const issueFilters = [
  <SearchInput key="q" source="q" alwaysOn />,
  <SelectInput
    key="status"
    source="status"
    choices={[
      { id: 'To Do', name: 'To Do' },
      { id: 'In Progress', name: 'In Progress' },
      { id: 'Done', name: 'Done' },
    ]}
  />,
  <SelectInput
    key="priority"
    source="priority"
    choices={[
      { id: 'Highest', name: 'Highest' },
      { id: 'High', name: 'High' },
      { id: 'Medium', name: 'Medium' },
      { id: 'Low', name: 'Low' },
      { id: 'Lowest', name: 'Lowest' },
    ]}
  />,
]

export const IssueList = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'))

  return (
    <List
      filters={issueFilters}
      filterDefaultValues={{ jql: 'assignee = currentUser() ORDER BY updated DESC' }}
      sort={{ field: 'updated', order: 'DESC' }}
      perPage={25}
    >
      {isSmall ? (
        <SimpleList
          primaryText={(record: RaRecord) => (record as JiraIssue).fields?.summary ?? ''}
          secondaryText={(record: RaRecord) => (record as JiraIssue).fields?.status?.name ?? ''}
          tertiaryText={(record: RaRecord) => (record as JiraIssue).key ?? ''}
          linkType="show"
        />
      ) : (
        <Datagrid rowClick="show" bulkActionButtons={false}>
          <TextField source="key" label="Key" sortable={false} />
          <TextField source="fields.summary" label="Summary" />
          <FunctionField
            label="Status"
            render={(record: RaRecord) => {
              const issue = record as JiraIssue
              return issue.fields?.status ? <StatusChip status={issue.fields.status} /> : null
            }}
          />
          <FunctionField
            label="Priority"
            render={(record: RaRecord) => {
              const issue = record as JiraIssue
              return issue.fields?.priority ? <PriorityIcon priority={issue.fields.priority} /> : null
            }}
          />
          <TextField source="fields.project.name" label="Project" sortable={false} />
          <DateField source="fields.updated" label="Updated" showTime={false} />
        </Datagrid>
      )}
    </List>
  )
}
