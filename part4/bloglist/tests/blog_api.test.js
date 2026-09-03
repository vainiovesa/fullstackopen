const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('Blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('id field called id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    assert(blog['id'])
    assert(!blog['_id'])
  })
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'valid',
    author: 'Tester',
    url: 'https://example.com/',
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map(b => b.title)
  assert(contents.includes('valid'))
})

test('blog added with no likes has 0 likes', async () => {
  const newBlog = {
    title: 'No likes',
    author: 'Tester',
    url: 'https://example.com/',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const resultingBlog = blogsAtEnd.filter(blog => blog.title === 'No likes')[0]
  assert.strictEqual(resultingBlog.likes, 0)
})

test('blog cannot be added without title', async () => {
  const newBlog = {
    author: 'Tester',
    url: 'https://example.com/'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('blog cannot be added without url', async () => {
  const newBlog = {
    title: 'Some title',
    author: 'Tester'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})
