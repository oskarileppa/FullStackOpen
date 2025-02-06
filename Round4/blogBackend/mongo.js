const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const title = process.argv[3]
const author = process.argv[4]
const url = process.argv[5]
const likes = process.argv[6]

const dbUrl =
  `mongodb+srv://fullstack:${password}@fullstackopen.fxdiy.mongodb.net/testApp?retryWrites=true&w=majority&appName=FullStackOpen`

mongoose.set('strictQuery', false)
mongoose.connect(dbUrl).then(() => {
  const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
  })

  const Blog = mongoose.model('Blog', blogSchema)


  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes,
  })

  if (process.argv.length<4) {
    console.log('blogs:')
    blog.find({}).then(result => {
      result.forEach(blog => {
        console.log(blog.title, blog.author, blog.url, blog.likes)
      })
      mongoose.connection.close()
    })
  } else {
    blog.save().then(() => {
      console.log(`added ${title} by author ${author} to blog list`)
      mongoose.connection.close()
    })
  }
})