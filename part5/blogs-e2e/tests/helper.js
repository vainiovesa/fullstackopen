const loginWith = async (page, username, password)  => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const logout = async (page) => {
  await page.getByRole('button', { name: 'logout' }).click()
}

const createBlog = async (page, title, author, url) => {
  const newBlog = page.getByRole('button', { name: 'new blog' });
  try {
    await newBlog.waitFor({ state: 'visible', timeout: 2000 });
    await newBlog.click();
  } catch {
  }
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByText(title).first().waitFor()
}

export { loginWith, logout, createBlog }
