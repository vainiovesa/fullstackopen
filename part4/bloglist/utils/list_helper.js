const dummy = (blogs) => {
  return 1
}

const totalLikes = blogs => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.length === 0
    ? 0 
    : blogs.reduce(reducer, 0)
}

const favouriteBlog = blogs => {
  const reducer = (blog1, blog2) => {
    return blog1.likes > blog2.likes ? blog1 : blog2
  }
  return blogs.reduce(reducer)
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog
}
