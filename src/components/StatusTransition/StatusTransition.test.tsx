import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { StatusTransition } from './StatusTransition'

const transitions = [
  { id: '11', name: 'To Do' },
  { id: '21', name: 'In Progress' },
  { id: '31', name: 'Done' },
]

describe('StatusTransition', () => {
  it('renders a button for each transition', () => {
    render(
      <StatusTransition
        issueKey="TEST-1"
        transitions={transitions}
        onTransition={vi.fn()}
        loading={false}
      />
    )
    expect(screen.getByText('To Do')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('calls onTransition with transition id when clicked', async () => {
    const onTransition = vi.fn()
    render(
      <StatusTransition
        issueKey="TEST-1"
        transitions={transitions}
        onTransition={onTransition}
        loading={false}
      />
    )
    fireEvent.click(screen.getByText('In Progress'))
    await waitFor(() => expect(onTransition).toHaveBeenCalledWith('21'))
  })

  it('disables all buttons when loading is true', () => {
    render(
      <StatusTransition
        issueKey="TEST-1"
        transitions={transitions}
        onTransition={vi.fn()}
        loading={true}
      />
    )
    screen.getAllByRole('button').forEach((btn) => {
      expect(btn).toBeDisabled()
    })
  })

  it('renders nothing when transitions array is empty', () => {
    const { container } = render(
      <StatusTransition
        issueKey="TEST-1"
        transitions={[]}
        onTransition={vi.fn()}
        loading={false}
      />
    )
    expect(container.firstChild).toBeNull()
  })
})
