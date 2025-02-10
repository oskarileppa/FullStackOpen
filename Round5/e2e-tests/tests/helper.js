const loginWith = async (page, username, password) => {
  await page.fill('input[name="Username"]', username)
  await page.fill('input[name="Password"]', password)
  await page.click('text=login')
}

const createBlog = async (page, title, author, url) => {
  await page.click('text=new blog')

  await page.fill('input[placeholder="The best title"]', title)
  await page.fill('input[placeholder="The best author"]', author)
  await page.fill('input[placeholder="http://thebesturl.com"]', url)
  await page.click('text=save')

  await page.waitForTimeout(5000)
}

module.exports = {
  loginWith,
  createBlog
}