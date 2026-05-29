import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PriorityIcon } from './PriorityIcon'

describe('PriorityIcon', () => {
  it('renders with aria-label for Highest', () => {
    render(<PriorityIcon priority={{ id: '1', name: 'Highest', iconUrl: '' }} />)
    expect(screen.getByLabelText('Highest priority')).toBeInTheDocument()
  })

  it('renders with aria-label for Medium', () => {
    render(<PriorityIcon priority={{ id: '3', name: 'Medium', iconUrl: '' }} />)
    expect(screen.getByLabelText('Medium priority')).toBeInTheDocument()
  })

  it('renders with aria-label for Lowest', () => {
    render(<PriorityIcon priority={{ id: '5', name: 'Lowest', iconUrl: '' }} />)
    expect(screen.getByLabelText('Lowest priority')).toBeInTheDocument()
  })

  it('renders gracefully for unknown priority', () => {
    render(<PriorityIcon priority={{ id: '9', name: 'Unknown', iconUrl: '' }} />)
    expect(screen.getByLabelText('Unknown priority')).toBeInTheDocument()
  })
})
