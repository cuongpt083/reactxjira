import Box from '@mui/material/Box'
import type { JiraPriority } from '@/types/jira'

const priorityColors: Record<string, string> = {
  Highest: '#FF5630',
  High:    '#FF7452',
  Medium:  '#FFA500',
  Low:     '#2684FF',
  Lowest:  '#0052CC',
}

const DEFAULT_COLOR = '#8993A4'

interface Props {
  priority: JiraPriority
}

export const PriorityIcon = ({ priority }: Props) => {
  const color = priorityColors[priority.name] ?? DEFAULT_COLOR
  return (
    <Box
      component="span"
      aria-label={`${priority.name} priority`}
      sx={{
        display: 'inline-block',
        width: 10,
        height: 10,
        borderRadius: '50%',
        bgcolor: color,
        flexShrink: 0,
      }}
    />
  )
}
