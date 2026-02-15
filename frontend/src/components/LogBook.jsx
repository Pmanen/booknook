import { useSelector } from 'react-redux'

import ArticleForm from './ArticleForm'

const LogBook = () => {
  const books = useSelector(state => state.books)
  const articles = useSelector(state => state.articles)

  return (
    <div>
      <h2>Reading Log</h2>
      <ArticleForm />
    </div>
  )
}

export default LogBook