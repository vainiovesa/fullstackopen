const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, logout, createBlog } = require('./helper')

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
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Hedger Tester',
        username: 'tester2',
        password: 'sekret2'
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
      await expect(page.getByText('logout')).toBeVisible()
      await expect(page.getByText('wrong username or password')).not.toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'tester', 'wrong')
      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('logout')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'tester', 'sekret')
      await expect(page.getByText('logout')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'a blog created by playwright', 'Playwright', 'https://playwright.dev/')
      await expect(page.getByText('a new blog a blog created by playwright by Playwright added')).toBeVisible()

      await page.getByText('a blog created by playwright by Playwright').last().click()

      await expect(page.getByText('https://playwright.dev/')).toBeVisible()
    })

    test('a new blog can be liked', async ({ page }) => {
      await createBlog(page, 'another blog created by playwright', 'Playwright', 'https://example.com/')
      await expect(page.getByText('another blog created by playwright by Playwright added')).toBeVisible()

      await page.getByText('another blog created by playwright').last().click()

      await expect(page.getByText('likes 0')).toBeVisible()

      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('a new blog can be deleted', async ({ page }) => {
      page.on('dialog', async dialog => await dialog.accept())

      await createBlog(page, 'another blog created by playwright', 'Playwright', 'https://example.com/')
      await expect(page.getByText('another blog created by playwright by Playwright added')).toBeVisible()

      await page.getByText('another blog created by playwright').last().click()

      await page.getByRole('button', { name: 'remove' }).click()

      await page.waitForResponse(response => response.request().method() === 'DELETE' && response.ok())
      await expect(page.getByText('another blog created by playwright by Playwright added')).not.toBeAttached()
      await expect(page.getByText('Removed another blog created by playwright by Playwright')).toBeVisible()
    })
  })

  test('Remove button only visible for user who added blog', async ({ page }) => {
    await loginWith(page, 'tester', 'sekret')
    await createBlog(page, 'another blog created by playwright', 'Playwright', 'https://example.com/')
  
    const blogText = page.getByText('another blog created by playwright')
    const blogElement = blogText.locator('..')

    await blogElement.getByRole('button', { name: 'view' }).click()
    await expect(blogElement.getByText('remove')).toBeVisible()

    await logout(page)

    await loginWith(page, 'tester2', 'sekret2')

    await blogElement.getByRole('button', { name: 'view' }).click()
    await expect(blogElement.getByText('remove')).not.toBeVisible()
  })

  test('Blogs ordered by likes', async ({ page }) => {
    await loginWith(page, 'tester', 'sekret')

    await createBlog(page, 'first blog', 'Tester', 'https://example.com/1')
    await createBlog(page, 'second blog', 'Author', 'https://example.com/2')
    await createBlog(page, 'third blog', 'Playwright', 'https://example.com/3')

    const firstBlogText = page.getByText('first blog')
    const firstBlogElement = firstBlogText.locator('..')
    await firstBlogElement.getByRole('button', { name: 'view' }).click()
    await firstBlogElement.getByRole('button', { name: 'like' }).click()

    const secondBlogText = page.getByText('second blog')
    const secondBlogElement = secondBlogText.locator('..')
    await secondBlogElement.getByRole('button', { name: 'view' }).click()
    await secondBlogElement.getByRole('button', { name: 'like' }).click()
    await expect(secondBlogElement.getByText('likes 1')).toBeVisible()
    await secondBlogElement.getByRole('button', { name: 'like' }).click()

    const thirdBlogText = page.getByText('third blog')
    const thirdBlogElement = thirdBlogText.locator('..')
    await thirdBlogElement.getByRole('button', { name: 'view' }).click()
    await expect(thirdBlogElement.getByText('likes 0')).toBeVisible()
    await expect(secondBlogElement.getByText('likes 2')).toBeVisible()
    await expect(firstBlogElement.getByText('likes 1')).toBeVisible()

    const first = await page.getByText('hide').first()
    const second = await page.getByText('hide').nth(1)
    const third = await page.getByText('hide').nth(2)

    const firstInOrder = first.locator('..')
    const secondInOrder = second.locator('..')
    const thirdInOrder = third.locator('..')

    await expect(firstInOrder.getByText('second blog')).toBeVisible()
    await expect(secondInOrder.getByText('first blog')).toBeVisible()
    await expect(thirdInOrder.getByText('third blog')).toBeVisible()
  })
})
