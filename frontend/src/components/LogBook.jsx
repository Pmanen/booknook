import { useSelector } from 'react-redux'

import ArticleForm from './ArticleForm'

const groupByDate = (entries) => {
  const groups = []
  let currentDate = null

  entries.forEach(entry => {
    const dateOnly = new Date(entry.date).toISOString().split('T')[0]

    if (dateOnly !== currentDate) {
      currentDate = dateOnly
      groups.push({ date: currentDate, entries: [] })
    }
    groups[groups.length -1].entries.push(entry)
  })

  return groups
}

const Entry = (props) => {
  if (props.article) {
    return (
      <div>
        {props.article.author} {props.article.outlet && `(${props.article.outlet})`} - "<a href={props.article.url}>{props.article.title}</a>" [{props.article.genreTag}]
        <p>Reading time: {props.readLength} minutes</p>
        {props.notes && <p>Notes: {props.notes}</p>}
      </div>
    )
  } else {
    return (
      <div>
        {props.book.author} - "{props.book.title}" [{props.book.genreTag}]
        <p>Pages read: {props.readLength}, current page: {props.currentPage}</p>
        {props.notes && <p>Notes: {props.notes}</p>}
      </div>
    )
  }
}

  

const LogBook = () => {
  const articleLogs = useSelector(state => state.articleLogs)
  const bookLogs = useSelector(state => state.bookLogs)

  const sortedLogs = articleLogs.concat(bookLogs).slice().sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  )



  return (
    <div>
      <h2>Reading Log</h2>
      <ArticleForm />
      {groupByDate(sortedLogs).map(group => (
        <div key={group.date}>
          <h3>{group.date}</h3>
          {group.entries.map(entry => (
            <Entry key={entry.id} {...entry} />
          ))}
        </div>
      ))}
    </div>
  )
}

export default LogBook