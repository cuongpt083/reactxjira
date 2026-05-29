import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusChip } from './StatusChip'

const makeStatus = (name: string, categoryKey: string) => ({
  id: '1',
  name,
  statusCategory: { id: 1, key: categoryKey, colorName: 'blue', name },
})

describe('StatusChip', () => {
  it('renders status name', () => {
    render(<StatusChip status={makeStatus('In Progress', 'indeterminate')} />)
    expect(screen.getByText('In Progress')).toBeInTheDocument()
  })

  it('renders with "new" category (To Do)', () => {
    render(<StatusChip status={makeStatus('To Do', 'new')} />)
    expect(screen.getByText('To Do')).toBeInTheDocument()
  })

  it('renders with "done" category', () => {
    render(<StatusChip status={makeStatus('Done', 'done')} />)
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('renders with unknown category gracefully', () => {
    render(<StatusChip status={makeStatus('Custom', 'unknown-category')} />)
    expect(screen.getByText('Custom')).toBeInTheDocument()
  })
})
