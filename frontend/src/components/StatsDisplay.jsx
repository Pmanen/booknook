import { useSelector } from 'react-redux'

const filterLogsByMonth = (logs, month, year) => {
  return logs.filter(log => {
    const logDate = new Date(log.date)
    return logDate.getMonth() + 1 === month &&
      logDate.getFullYear() === year
  })
}

const StatsDisplay = () => {
  const bookLogs = useSelector(state => state.bookLogs)
  const articleLogs = useSelector(state => state.articleLogs)

  const currentMonthNumber = new Date().getMonth() + 1
  const currentYearNumber = new Date().getFullYear()
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' })
  const filteredBookLogs = filterLogsByMonth(bookLogs, currentMonthNumber, currentYearNumber)
  const filteredArticleLogs = filterLogsByMonth(articleLogs, currentMonthNumber, currentYearNumber)

  const countUniqueBooks = new Set(filteredBookLogs.map(log => log.book.id)).size;
  const countFinishedBooks = filteredBookLogs.filter(log => log.finished).length
  const countArticles = filteredArticleLogs.length
  const sumArticlePages = filteredArticleLogs.reduce((total, log) => total + log.readLength, 0)
  const sumBookPages = filteredBookLogs.reduce((total, log) => total + log.readLength, 0)

  return (
    <div>
      <h3>Reading stats for the month {currentMonthName}</h3>
      <p>Books read: {countUniqueBooks}, pages: {sumBookPages}</p>
      <p>Books finished: {countFinishedBooks}</p>
      <p>Articles read: {countArticles}, pages: {sumArticlePages}</p>
      <p>Total pages read: {sumBookPages + sumArticlePages}</p>
    </div>

  )
}

export default StatsDisplay