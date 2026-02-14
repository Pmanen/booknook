import { useState } from 'react'
import {
  Routes,
  Route,
} from 'react-router-dom'

const App = () => {
  return (
    <div>
      <h1>Book App!</h1>

      <Routes>
        <Route path="/" element={<h2>Real app</h2>} />
      </Routes>
    </div>
  )
}

export default App
