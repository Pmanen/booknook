import { useSelector } from 'react-redux'

const CurrentlyReading = () => {
  const books = useSelector(state => state.books)

  return (
    <div>
      <h2>Currently reading</h2>
    </div>
  )
}

export default CurrentlyReading