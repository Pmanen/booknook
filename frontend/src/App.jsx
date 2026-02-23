import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom'

import './App.css'
import Library from './components/Library'
import LogBook from './components/Logbook'
import StatsDisplay from './components/StatsDisplay'
import { initializeBooks } from './reducers/bookReducer'
import { initializeArticles } from './reducers/articleReducer'
import { initializeArticleLogs } from './reducers/articleLogReducer'
import { initializeBookLogs } from './reducers/bookLogReducer'

const App = () => {
  const dispatch = useDispatch()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  useEffect(() => {
    dispatch(initializeBooks())
    dispatch(initializeArticles())
    dispatch(initializeArticleLogs())
    dispatch(initializeBookLogs())
  }, [dispatch])

  return (
    <div className="bg-neutral-100 p-8">
      <div className="flex justify-center items-center gap-4 h-8 mb-6 text-gray-700">
        <Link to="/library" className={isActive('/library') ? 'underline' : 'hover:underline'}>
          Library
        </Link>
        <Link to="/log" className={isActive('/log') ? 'underline' : 'hover:underline'}>
          Logbook
        </Link>
        <Link to="/" className={isActive('/') ? 'underline' : 'hover:underline'}>
          Stats
        </Link>
      </div>

      <Routes>
        <Route path="/" element={<StatsDisplay />} />
        <Route path="/library" element={<Library />} />
        <Route path="/log" element={<LogBook />} />
      </Routes>
    </div>
  )
}

export default App
