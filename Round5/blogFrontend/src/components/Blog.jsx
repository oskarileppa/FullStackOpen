import { useState } from 'react'

const Blog = ({ blog, user, onSubmit, onDelete }) => {

  const blogStyle = {
    paddingTop: 5,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [detailsVisible, setDetailsVisible] = useState(false)

  const updateLikes = async (event) => {
    event.preventDefault()
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user }
    console.log('blog username before onSubmit:', blog.user.username)
    onSubmit(updatedBlog)
    console.log('blog user name after onSubmit:', blog.user.username)
  }

  const deleteBlog = async (event) => {
    event.preventDefault()
    onDelete(blog)
  }

  const toggleVisibility = () => {
    setDetailsVisible(!detailsVisible)
  }
  return (
    <div style={blogStyle} className='blog'>
      {blog.title} by {blog.author} <button onClick={toggleVisibility}>{detailsVisible ? 'hide' : 'view'}</button>
      {detailsVisible && (
        <div>
          <a href={blog.url}>{blog.url}</a> <br />
          {blog.likes} likes <button onClick={updateLikes}>like</button> <br />
            added by {blog.user.name || blog.user.username} <br />
          {blog.user.username === user.username ? <button onClick={deleteBlog}>remove</button> : ''}
        </div>
      )}
    </div>
  )}

export default Blog