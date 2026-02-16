import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Routes,
  Route,
  Link
} from 'react-router-dom'

import Library from './components/Library'
import LogBook from './components/Logbook'
import { initializeBooks } from './reducers/bookReducer'
import { initializeArticles } from './reducers/articleReducer'
import { initializeArticleLogs } from './reducers/articleLogReducer'
import { initializeBookLogs } from './reducers/bookLogReducer'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBooks())
    dispatch(initializeArticles())
    dispatch(initializeArticleLogs())
    dispatch(initializeBookLogs())
  }, [dispatch])

  return (
    <div>
      <div>
        <Link to="/library">Library</Link>
        <Link to="/log">Logbook</Link>
      </div>
      <h1>Book App!</h1>

      <Routes>
        <Route path="/" element={<h2>Real app</h2>} />
        <Route path="/library" element={<Library />} />
        <Route path="/log" element={<LogBook />} />
      </Routes>
    </div>
  )
}

export default App
