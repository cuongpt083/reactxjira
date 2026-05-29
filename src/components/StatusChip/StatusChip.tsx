import Chip from '@mui/material/Chip'
import type { JiraStatus } from '@/types/jira'

const categoryColors: Record<string, { bg: string; color: string }> = {
  new:           { bg: '#E8ECF0', color: '#42526E' },
  indeterminate: { bg: '#DEEBFF', color: '#0747A6' },
  done:          { bg: '#E3FCEF', color: '#006644' },
}

const DEFAULT_COLOR = { bg: '#F4F5F7', color: '#42526E' }

interface Props {
  status: JiraStatus
}

export const StatusChip = ({ status }: Props) => {
  const { bg, color } = categoryColors[status.statusCategory.key] ?? DEFAULT_COLOR
  return (
    <Chip
      label={status.name}
      size="small"
      sx={{ bgcolor: bg, color, fontWeight: 500, fontSize: '0.75rem', height: 20 }}
    />
  )
}
