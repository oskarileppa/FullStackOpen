import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Submit from './Submit'

test('submit form calls onSubmit with correct data', async () => {
  const onSubmit = vi.fn()

  render(<Submit onSubmit={onSubmit} />)

  const user = userEvent.setup()
  const title = screen.getByPlaceholderText('The best title')
  const author = screen.getByPlaceholderText('The best author')
  const url = screen.getByPlaceholderText('http://thebesturl.com')
  const button = screen.getByText('save')

  await user.type(title, 'Test Title')
  await user.type(author, 'Test Author')
  await user.type(url, 'http://test.com')
  await user.click(button)

  expect(onSubmit).toHaveBeenCalledWith({
    title: 'Test Title',
    author: 'Test Author',
    url: 'http://test.com'
  })
})