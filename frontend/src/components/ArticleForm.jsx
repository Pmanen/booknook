import { useState } from "react"
import { useField } from "../hooks/useField"
import { useDispatch } from "react-redux"

import { appendArticle } from "../reducers/articleReducer"

const ArticleForm = () => {
  const dispatch = useDispatch()
  const titleInput = useField('text')
  const authorInput = useField('text')
  const outletInput = useField('text')
  const urlInput = useField('text')
  const datePublishedInput = useField('date')
  const lengthInput = useField('text')
  const genreTagInput = useField('text')
  const [notes, setNotes] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)

  const handleCreate = async (event) => {
    event.preventDefault()

    const newArticle = {
      title: titleInput.value,
      author: authorInput.value,
      outlet: outletInput.value,
      url: urlInput.value,
      length: lengthInput.value,
      datePublished: datePublishedInput.value,
      genreTag: genreTagInput.value
    }
    const newLog = {
      notes,
      isFavorite
    }
    dispatch(appendArticle(newArticle, newLog))
  }

  return (
    <div>
      <h2>Add article</h2>
      <form onSubmit={handleCreate}>
        title:
        <input {...titleInput} />
        <br />
        author:
        <input {...authorInput} />
        <br />
        outlet:
        <input {...outletInput} />
        <br />
        url:
        <input {...urlInput} />
        <br />
        date published:
        <input {...datePublishedInput} />
        <br />
        length in minutes:
        <input {...lengthInput} />
        <br />
        genre tag:
        <input {...genreTagInput} />
        <br />
        notes:
        <textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <br />
        favorite:
        <input 
          type="checkbox"
          checked={isFavorite}
          onChange={(e) => setIsFavorite(e.target.checked)}
        />
        <button>Add</button>
      </form>
    </div>
  )
}

export default ArticleForm