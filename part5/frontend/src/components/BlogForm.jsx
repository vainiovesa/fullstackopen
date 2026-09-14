import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
    })

    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
  }

  return (
    <div>
      <h2>Add a blog</h2>

      <form onSubmit={addBlog}>
      <div>
        <label>
          title:
          <input value={newBlogTitle} onChange={event => setNewBlogTitle(event.target.value)} />
        </label>
      </div>
      <div>
        <label>
          author:
          <input value={newBlogAuthor} onChange={event => setNewBlogAuthor(event.target.value)} />
        </label>
      </div>
      <div>
        <label>
          url:
          <input value={newBlogUrl} onChange={event => setNewBlogUrl(event.target.value)} />
        </label>
      </div>
      
      <button type="submit">create</button>
    </form>

    </div>
  )
}

export default BlogForm