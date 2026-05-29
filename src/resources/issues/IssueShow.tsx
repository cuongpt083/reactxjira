import { useState } from 'react'
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  FunctionField,
  useRecordContext,
  useDataProvider,
  useRefresh,
  useNotify,
} from 'react-admin'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MuiTextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import type { RaRecord } from 'react-admin'
import { StatusChip } from '@/components/StatusChip/StatusChip'
import { PriorityIcon } from '@/components/PriorityIcon/PriorityIcon'
import { StatusTransition } from '@/components/StatusTransition/StatusTransition'
import type { JiraIssue, JiraTransition } from '@/types/jira'

const IssueActions = () => {
  const record = useRecordContext<RaRecord & JiraIssue>()
  const dataProvider = useDataProvider()
  const refresh = useRefresh()
  const notify = useNotify()
  const [transitions, setTransitions] = useState<JiraTransition[]>([])
  const [loadingTransitions, setLoadingTransitions] = useState(false)
  const [comment, setComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  if (!record) return null

  const loadTransitions = async () => {
    if (transitions.length > 0) return
    setLoadingTransitions(true)
    try {
      const response = await dataProvider.getOne('issue-transitions', { id: record.key as string })
      setTransitions((response.data as { transitions: JiraTransition[] }).transitions ?? [])
    } catch {
      notify('Failed to load transitions', { type: 'error' })
    } finally {
      setLoadingTransitions(false)
    }
  }

  const handleTransition = async (transitionId: string) => {
    setLoadingTransitions(true)
    try {
      await dataProvider.update('issue-transitions', {
        id: record.key as string,
        data: { transition: { id: transitionId } },
        previousData: record,
      })
      notify('Status updated', { type: 'success' })
      setTransitions([])
      refresh()
    } catch {
      notify('Failed to update status', { type: 'error' })
    } finally {
      setLoadingTransitions(false)
    }
  }

  const handleAddComment = async () => {
    if (!comment.trim()) return
    setSubmittingComment(true)
    try {
      await dataProvider.create('issue-comments', {
        data: { issueKey: record.key, body: comment.trim() },
      })
      notify('Comment added', { type: 'success' })
      setComment('')
      refresh()
    } catch {
      notify('Failed to add comment', { type: 'error' })
    } finally {
      setSubmittingComment(false)
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
        Transitions
      </Typography>
      <Box onMouseEnter={loadTransitions}>
        <StatusTransition
          issueKey={record.key as string}
          transitions={transitions}
          onTransition={handleTransition}
          loading={loadingTransitions}
        />
        {transitions.length === 0 && !loadingTransitions && (
          <Button size="small" variant="text" onClick={loadTransitions}>
            Load transitions
          </Button>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
        Add Comment
      </Typography>
      <MuiTextField
        multiline
        minRows={2}
        maxRows={6}
        fullWidth
        size="small"
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ mb: 1 }}
      />
      <Button
        variant="contained"
        size="small"
        disabled={!comment.trim() || submittingComment}
        onClick={handleAddComment}
      >
        {submittingComment ? 'Saving…' : 'Save'}
      </Button>
    </Box>
  )
}

export const IssueShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="key" label="Issue Key" />
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
          return issue.fields?.priority ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PriorityIcon priority={issue.fields.priority} />
              <span>{issue.fields.priority.name}</span>
            </Box>
          ) : null
        }}
      />
      <TextField source="fields.issuetype.name" label="Type" />
      <TextField source="fields.assignee.displayName" label="Assignee" />
      <TextField source="fields.reporter.displayName" label="Reporter" />
      <DateField source="fields.created" label="Created" />
      <DateField source="fields.updated" label="Updated" />
      <TextField source="fields.description" label="Description" />
      <IssueActions />
    </SimpleShowLayout>
  </Show>
)
