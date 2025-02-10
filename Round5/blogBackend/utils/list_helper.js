const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (favorite, blog) => {
    return favorite.likes > blog.likes
      ? favorite
      : blog
  }

  return blogs.length === 0
    ? null
    : blogs.reduce(reducer, blogs[0])
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authors = blogs.reduce((authors, blog) => {
    const author = authors.find(author => author.author === blog.author)
    if (author) {
      author.blogs += 1
    } else {
      authors.push({
        author: blog.author,
        blogs: 1
      })
    }
    return authors
  }, [])

  const mostBlogsAuthor = authors.reduce((max, author) => {
    return author.blogs > max.blogs ? author : max
  })

  return mostBlogsAuthor
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authors = blogs.reduce((authors, blog) => {
    const author = authors.find(author => author.author === blog.author)
    if (author) {
      author.likes += blog.likes
    } else {
      authors.push({
        author: blog.author,
        likes: blog.likes
      })
    }
    return authors
  }, [])

  const mostLikesAuthor = authors.reduce((max, author) => {
    return author.likes > max.likes ? author : max
  })

  return mostLikesAuthor
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}