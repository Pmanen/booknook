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
      title: titleInput.input.value,
      author: authorInput.input.value,
      outlet: outletInput.input.value,
      url: urlInput.input.value,
      length: lengthInput.input.value,
      datePublished: datePublishedInput.input.value,
      genreTag: genreTagInput.input.value
    }
    const newLog = {
      notes,
      isFavorite
    }
    dispatch(appendArticle(newArticle, newLog))

    titleInput.reset()
    authorInput.reset()
    outletInput.reset()
    urlInput.reset()
    lengthInput.reset()
    datePublishedInput.reset()
    genreTagInput.reset()
    setNotes('')
    setIsFavorite(false)
  }

  return (
    <div>
      <form onSubmit={handleCreate}>
        title:
        <input {...titleInput.input} />
        <br />
        author:
        <input {...authorInput.input} />
        <br />
        outlet:
        <input {...outletInput.input} />
        <br />
        url:
        <input {...urlInput.input} />
        <br />
        date published:
        <input {...datePublishedInput.input} />
        <br />
        length in minutes:
        <input {...lengthInput.input} />
        <br />
        genre tag:
        <input {...genreTagInput.input} />
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