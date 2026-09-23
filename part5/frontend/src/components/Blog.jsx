const Blog = ({ blog, handleLike, handleRemove, user }) => {

  const like = () => {
    handleLike(blog)
  }

  const remove = () => {
    handleRemove(blog)
  }

  return (
    <div>
      <div>
        <h3>
          {blog.author}: {blog.title}
        </h3>
        <a href={blog.url}>{blog.url}</a>
        <div>
          likes {blog.likes} {user && <button onClick={like}>like</button>}
        </div>
        <div>
          Added by {blog.user.username}
        </div>
        {user && user.username === blog.user.username &&
          <div>
            <button onClick={remove}>remove</button>
          </div>
        }
      </div>
    </div>
  )}

export default Blog
