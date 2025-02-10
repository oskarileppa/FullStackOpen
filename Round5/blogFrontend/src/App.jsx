import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import Logout from './components/Logout'
import blogService from './services/blogs'
import loginService from './services/login'
import Submit from './components/Submit'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const login = async (userObject) => {
    try {
      const loggedUser = await loginService.login(userObject)

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(loggedUser)
      )

      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      setNotificationMessage('Logged in successfully')

      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const onSubmit = async (blogObject) => {
    try {
      if (blogs.some(blog =>
        blog.title === blogObject.title &&
        blog.author === blogObject.author &&
        blog.url === blogObject.url &&
        blog.likes === blogObject.likes &&
        blog.user.id === blogObject.user.id)) {
        setErrorMessage('Blog already exists')
        setTimeout(() => setErrorMessage(null), 5000)
        return
      }

      if (blogs.some(blog =>
        blog.title === blogObject.title &&
        blog.author === blogObject.author &&
        blog.url === blogObject.url &&
        blog.likes !== blogObject.likes &&
        blog.user.id === blogObject.user.id)) {

        const blog = blogs.find(blog =>
          blog.title === blogObject.title &&
          blog.author === blogObject.author &&
          blog.url === blogObject.url &&
          blog.user.id === blogObject.user.id
        )

        const changedBlog = { ...blog, likes: blogObject.likes }
        const updatedBlog = await blogService.update(blog.id, changedBlog)

        // Maintain the user reference in the updated blog
        updatedBlog.user = blog.user

        setBlogs(blogs.map(b => b.id !== blog.id ? b : updatedBlog))
        setNotificationMessage(`Updated the likes of ${blogObject.title}`)
        setTimeout(() => setNotificationMessage(null), 5000)
        return
      }

      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)

      // Maintain the logged-in user information in the new blog
      returnedBlog.user = user

      setBlogs(blogs.concat(returnedBlog))
      setNotificationMessage(`a new blog "${returnedBlog.title}" by ${returnedBlog.author} added successfully`)
      setTimeout(() => setNotificationMessage(null), 5000)

    } catch (error) {
      console.log(error)
      setErrorMessage(error.response?.data?.error || 'Failed to add or update blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }


  const onDelete = async (blogObject) => {
    try {
      if(blogObject.user.username === user.username) {
        if(window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)) {
          await blogService.remove(blogObject.id)
          setBlogs(blogs.filter(blog => blog.id !== blogObject.id))
          setNotificationMessage(`Removed blog ${blogObject.title} by ${blogObject.author}`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        }
        else {
          setErrorMessage('Failed to remove blog')
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        }
      }
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }



  return (
    <div>
      <Notification error={errorMessage} notification={notificationMessage} />
      <h1>blogs</h1>
      {user === null ? (
        <Login
          login={login}
        />
      ) : (
        <>
          <p>{user.name || user.username} logged in</p>
          <Togglable buttonLabel='Add new blog' ref={blogFormRef} >
            <Submit
              onSubmit={onSubmit}
            />
          </Togglable>
          {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
            <Blog key={blog.id} blog={blog} user={user} onSubmit={onSubmit} onDelete={onDelete}/>
          )}
          <Logout handleLogout={handleLogout} />
        </>
      )}
    </div>
  )
}

export default App