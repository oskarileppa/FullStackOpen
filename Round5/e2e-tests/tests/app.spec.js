// @ts-check
const { test, expect } = require('@playwright/test')
const { loginWith } = require('./helper')
const { createBlog } = require('./helper')

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: { 
        username: 'testuser', 
        name: 'Test User', 
        password: 'sekret' }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Blogs')
    await expect(locator).toBeVisible()
    await expect(page.locator('text=login')).toBeVisible()
  })

  test.describe('Login', () => {
    test('User can login', async ({ page }) => {
      await loginWith(page, 'testuser', 'sekret')
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })
  
    test('login fails with wrong password', async ({ page }) => {
      await loginWith(page, 'testuser', 'wrong')
  
      const errorDiv = await page.locator('.error')
  
      await expect(errorDiv).toContainText('invalid username or password')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
  
      await expect(page.getByText('Test User logged in')).not.toBeVisible()
    })
  })

  test.describe('when logged in', () => {
    test.beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'sekret')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Test blog by Test author', 'Test author', 'http://testblog.com')

      await page.waitForTimeout(5000)

      await expect(page.getByText('Test blog by Test author')).toBeVisible()
    })

    test.describe('and a blog exists', () => {
      test.beforeEach(async ({ page }) => {
        await createBlog(page, 'Test blog', 'Test author', 'http://testblog.com')
      })

      test('user can like a blog', async ({ page }) => {
        await page.click('text=view')
        await page.click('text=like')

        await page.waitForTimeout(5000)

        await expect(page.getByText('1 likes')).toBeVisible()
      })

      test('user can delete a blog', async ({ page }) => {
        await page.click('text=view')
      
        // Set up dialog handler before triggering the dialog
        page.once('dialog', async (dialog) => {
          if (dialog.type() === 'confirm') {
            await dialog.accept()
          }
        })
      
        // Click the remove button and wait for the blog to be removed
        await page.click('text=remove')

        await page.waitForTimeout(5000)

        await expect(page.getByText('Test blog by Test author')).not.toBeVisible()
      })
      

      test('user cannot delete a blog created by another user', async ({ page, request }) => {
        
        await page.click('text=logout')

        await request.post('/api/users', {
          data: { 
            username: 'anotheruser', 
            name: 'Another User', 
            password: 'sekret' }
        })

        await loginWith(page, 'anotheruser', 'sekret')

        await page.click('text=view')
        await expect(page.locator('text=remove')).not.toBeVisible()
      })
    })
  })
})
