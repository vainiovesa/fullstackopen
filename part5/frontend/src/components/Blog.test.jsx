import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    author: 'test author',
    title: 'test title',
    url: 'www.example.com',
    likes: 0,
    user: {
      username: 'tester'
    }
  }

  render(<Blog blog={blog} />)

  const elements = screen.getAllByText('test title test author')
  expect(elements[0]).toBeVisible()
  expect(elements[1]).not.toBeVisible()

  const urlElement = screen.getByText('www.example.com')
  const likesElement = screen.getByText('likes 0')
  expect(urlElement).not.toBeVisible()
  expect(likesElement).not.toBeVisible()
})

test('clicking view shows url and likes', async () => {
  const blog = {
    author: 'test author',
    title: 'test title',
    url: 'www.example.com',
    likes: 0,
    user: {
      username: 'tester'
    }
  }

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const urlElement = screen.getByText('www.example.com')
  const likesElement = screen.getByText('likes 0')
  const userElement = screen.getByText('tester')
  expect(urlElement).toBeVisible()
  expect(likesElement).toBeVisible()
  expect(userElement).toBeVisible()
})
