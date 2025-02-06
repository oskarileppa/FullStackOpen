const { test, describe, after, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const assert = require('assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

let token

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'testuser', passwordHash })
  await user.save()

  token = await helper.getValidToken()

  for(let blog of helper.initialBlogs){
    let blogObject = new Blog({ ...blog, user: user.id })
    await blogObject.save()
  }
})

describe('when there is initially some blogs saved', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('blog has id property', async () => {
    const response = await api.get('/api/blogs')
    assert(response.body[0].id)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(e => e.title)
    assert(titles.includes('test title 1'))
  })

})

describe('viewing a specific blog', () => {

  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // Normalize user field for comparison
    const normalizedResultBlog = { ...resultBlog.body, user: resultBlog.body.user.toString() }
    const expectedBlog = { ...blogToView, user: blogToView.user.toString() }

    assert.deepStrictEqual(normalizedResultBlog, expectedBlog)
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})

describe('addition of a new blog', () => {

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'test title 3',
      author: 'test author 3',
      url: 'test url 3',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(e => e.title)
    assert(titles.includes('test title 3'))
  })

  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'test author 3',
      url: 'test url 3',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

  })

  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'test title 3',
      author: 'test author 3',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

  })

  test('blog without user token is not added', async () => {
    const newBlog = {
      title: 'test title 3',
      author: 'test author 3',
      url: 'test url 3',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('blog without likes is added with 0 likes', async () => {
    const newBlog = {
      title: 'test title 3',
      author: 'test author 3',
      url: 'test url 3'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = blogsAtEnd.find(e => e.title === newBlog.title)
    assert.strictEqual(addedBlog.likes, 0)
  })

})

describe('deletion of a blog', () => {

  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    console.log(blogToDelete)

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(e => e.title)
    assert(!titles.includes(blogToDelete.title))
  })

  test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = { ...blogToUpdate, likes: 10 }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const likes = blogsAtEnd.map(e => e.likes)
    assert(likes.includes(10))
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes('mluukkai'))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ro',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('is shorter than the minimum allowed length'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'sa',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('is shorter than the minimum allowed length'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

})

describe('login', () => {
  test('succeeds with correct credentials', async () => {
    const credentials = {
      username: 'testuser',
      password: 'sekret',
    }

    const result = await api
      .post('/api/login')
      .send(credentials)
      .expect(200)

    assert(result.body.token)
  })

  test('fails with wrong credentials', async () => {
    const credentials = {
      username: 'testuser',
      password: 'wrongpassword',
    }

    const result = await api
      .post('/api/login')
      .send(credentials)
      .expect(401)

    assert(result.body.error.includes('invalid username or password'))
  })
})

after(async () => {
  await mongoose.connection.close()
})