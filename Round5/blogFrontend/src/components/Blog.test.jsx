import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect } from 'vitest'

test('renders content', async () => {
  const testBlog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  const testUser = {
    username: 'testuser',
    name: 'Test User'
  }

  //const mockHandler = vi.fn()

  render(<Blog blog={testBlog} user={testUser} onSubmit={() => {}} onDelete={() => {}} />)

  screen.debug()

  expect(screen.getByText('Component testing is done with react-testing-library by Test Author')).toBeDefined()

  expect(screen.queryByText(/http:\/\/test.com/)).not.toBeInTheDocument()
  expect(screen.queryByText(/5 likes/)).not.toBeInTheDocument()
})

test('URL and likes are shown when view button is clicked', async () => {
  const testBlog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  const testUser = {
    username: 'testuser',
    name: 'Test User'
  }

  render(<Blog blog={testBlog} user={testUser} onSubmit={() => {}} onDelete={() => {}} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(screen.getByText('Component testing is done with react-testing-library by Test Author')).toBeDefined()
  expect(screen.getByText(/http:\/\/test.com/)).toBeDefined()
  expect(screen.getByText(/5 likes/)).toBeDefined()
})

test('like button is clicked twice', async () => {
  const testBlog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  const testUser = {
    username: 'testuser',
    name: 'Test User'
  }

  const mockHandler = vi.fn()

  render(<Blog blog={testBlog} user={testUser} onSubmit={mockHandler} onDelete={() => {}} />)
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler).toHaveBeenCalledTimes(2)
})