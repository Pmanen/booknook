import { useSelector } from 'react-redux'

const Library = () => {
  const books = useSelector(state => state.books)
  const articles = useSelector(state => state.articles)

  return (
    <div>
      <h2>Library</h2>
      {books.map(book => (
        <p key={book.id}>{book.author}, "{book.title}". ({book.genreTag})</p>
      ))}
      {articles.map(article => (
        <p key={article.id}>{article.author} ({article.outlet}), "{article.title}". ({article.genreTag})</p>
      ))}
    </div>
  )
}

export default Library