import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async event => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const addBlog = event => {
    event.preventDefault()
    const noteObject = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
    }

    blogService
      .create(noteObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewBlogTitle('')
        setNewBlogAuthor('')
        setNewBlogUrl('')
      })
  }

  const handleBlogTitleChange = (event) => {
    setNewBlogTitle(event.target.value)
  }

  const handleBlogAuthorChange = (event) => {
    setNewBlogAuthor(event.target.value)
  }

  const handleBlogUrlChange = (event) => {
    setNewBlogUrl(event.target.value)
  }

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        <label>
          title:
          <input value={newBlogTitle} onChange={handleBlogTitleChange} />
        </label>
      </div>
      <div>
        <label>
          author:
          <input value={newBlogAuthor} onChange={handleBlogAuthorChange} />
        </label>
      </div>
      <div>
        <label>
          url:
          <input value={newBlogUrl} onChange={handleBlogUrlChange} />
        </label>
      </div>
      
      <button type="submit">create</button>
    </form>
  )

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} />

      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in<button onClick={handleLogout}>logout</button></p>
          {blogForm()}
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      )}
    </div>
  )
}

export default App
