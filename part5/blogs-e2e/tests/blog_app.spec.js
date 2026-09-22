const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Esther Tester',
        username: 'tester',
        password: 'sekret'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('login')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'tester', 'sekret')
      await expect(page.getByText('Esther Tester logged in')).toBeVisible()
      await expect(page.getByText('wrong username or password')).not.toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'tester', 'wrong')
      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('Esther Tester logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'tester', 'sekret')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'a blog created by playwright', 'Playwright', 'https://playwright.dev/')
      await expect(page.getByText('a new blog a blog created by playwright by Playwright added')).toBeVisible()

      const blogText = page.getByText('a blog created by playwright')
      const blogElement = blogText.locator('..')

      await blogElement
        .getByRole('button', { name: 'view' }).click()
      await expect(blogElement.getByText('https://playwright.dev/')).toBeVisible()
    })

    test('a new blog can be liked', async ({ page }) => {
      await createBlog(page, 'another blog created by playwright', 'Playwright', 'https://example.com/')

      const blogText = page.getByText('another blog created by playwright')
      const blogElement = blogText.locator('..')

      await blogElement.getByRole('button', { name: 'view' }).click()
      await expect(blogElement.getByText('likes 0')).toBeVisible()

      await blogElement.getByRole('button', { name: 'like' }).click()
      await expect(blogElement.getByText('likes 1')).toBeVisible()
    })

    test('a new blog can be deleted', async ({ page }) => {
      page.on('dialog', async dialog => await dialog.accept())

      await createBlog(page, 'third blog created by playwright', 'Playwright', 'https://example.com/')
      await page.getByRole('button', { name: 'view' }).click()

      const blog = page.getByText('third blog created by playwright')

      await page.getByRole('button', { name: 'remove' }).click()
      await page.waitForResponse(response => response.request().method() === 'DELETE' && response.ok())
      await expect(blog).not.toBeAttached()
    })
  })
})
