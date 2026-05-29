import ButtonGroup from '@mui/material/ButtonGroup'
import Button from '@mui/material/Button'
import type { JiraTransition } from '@/types/jira'

interface Props {
  issueKey: string
  transitions: JiraTransition[]
  onTransition: (transitionId: string) => void
  loading: boolean
}

export const StatusTransition = ({ transitions, onTransition, loading }: Props) => {
  if (transitions.length === 0) return null

  return (
    <ButtonGroup size="small" variant="outlined" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
      {transitions.map((t) => (
        <Button
          key={t.id}
          disabled={loading}
          onClick={() => onTransition(t.id)}
          sx={{ textTransform: 'none', fontSize: '0.8125rem' }}
        >
          {t.name}
        </Button>
      ))}
    </ButtonGroup>
  )
}
