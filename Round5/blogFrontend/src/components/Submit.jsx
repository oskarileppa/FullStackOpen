import { useState } from 'react'

const Submit = (props) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    props.onSubmit({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>Add a new blog</h2>
      <form onSubmit={submit}>
        <div>
                Title:
          <input
            value={newTitle}
            placeholder='The best title'
            onChange={({ target }) => setNewTitle(target.value)}
          />
        </div>
        <div>
                Author:
          <input
            value={newAuthor}
            placeholder='The best author'
            onChange={({ target }) => setNewAuthor(target.value)}
          />
        </div>
        <div>
                URL:
          <input
            value={newUrl}
            placeholder='http://thebesturl.com'
            onChange={({ target }) => setNewUrl(target.value)}
          />
        </div>
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default Submit