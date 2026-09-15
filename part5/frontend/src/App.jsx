import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
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
      setNotification({message: 'wrong username or password', type: 'error'})
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = async event => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    setNotification({message: 'Logged out'})
    setTimeout(() => {
      setNotification(null)
    }, 5000)
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

  const addBlog = blogObject => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNotification({message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`})
      })
      .catch(e => {
        setNotification({message: e.response.data.error, type: 'error'})
      })

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLike = (blogObject) => {
    const newBlogObject = {...blogObject, likes: blogObject.likes + 1}
    blogService
      .update(newBlogObject)
      .then(returnedObject => {
        const newBlogs = blogs.map(blog => {
          return blog.id === newBlogObject.id ? returnedObject : blog
        })
        setBlogs(newBlogs.sort((a, b) => b.likes - a.likes))
      })
      .catch(e => {
        setNotification({message: e.response.data.error, type: 'error'})
      })
  }

  return (
    <div>
      <h2>blogs</h2>
      {notification && <Notification message={notification.message} type={notification.type} />}

      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in<button onClick={handleLogout}>logout</button></p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} handleLike={handleLike} />
          )}
        </div>
      )}
    </div>
  )
}

export default App
