const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (_, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  })

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response, next) => {
  const { likes } = request.body

  const blogToModify = await Blog.findById(request.params.id)
  blogToModify.likes = likes

  const modifiedBlog = await blogToModify.save()
  response.json(modifiedBlog)
})

module.exports = blogRouter
