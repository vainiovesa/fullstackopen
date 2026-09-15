import { useState } from "react"

const Blog = ({ blog, handleLike, handleRemove, userOwnsThis }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const like = () => {
    handleLike(blog)
  }

  const remove = () => {
    handleRemove(blog)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  return (

    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>

      <div style={showWhenVisible}>
        <div>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button>
        </div>
        <div>
          {blog.url}
        </div>
        <div>
          likes {blog.likes} <button onClick={like}>like</button>
        </div>
        <div>
          {blog.user.username}
        </div>
        {userOwnsThis && 
          <div>
            <button
              style={{backgroundColor: 'lightblue', borderRadius: '5px'}}
              onClick={remove}>remove</button>
          </div>
        }
      </div>   
  </div>
)}

export default Blog
