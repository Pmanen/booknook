import { useSelector } from 'react-redux'
import { useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { FaBookOpen } from "react-icons/fa";

import '../App.css'
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

const EntryNotes = ({notes}) => {
  const [expanded, setExpanded] = useState(false)
  
  const charLimit = 600 // estimate for ~100 words
  const isLong = notes.length > charLimit
  const truncatedNotes = isLong ? notes.substring(0, charLimit) + '...' : notes
  const displayNotes = expanded ? notes : truncatedNotes
  
  return (
    <div className="border-l-2 border-amber-600 pl-3 text-gray-700 whitespace-pre-wrap">
      <div>{displayNotes}</div>
      {isLong && (
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-xs italic text-amber-600 hover:text-amber-700 mt-1"
        >
          {expanded ? 'show less' : 'expand'}
        </button>
      )}
    </div>
  )
}

const Entry = (props) => {
  if (props.article) {
    return (
      <div className="p-1 mb-3">
        {props.article.author} {props.article.outlet && `(${props.article.outlet})`} - "<a href={props.article.url} target="_blank" rel="noopener.noreferrer">{props.article.title}</a>". 
        <span className='text-red-800 inline-block text-xs font-semibold mx-1 px-2 py-0.5 rounded-full'>{props.article.genreTag}</span>
        <p className="text-sm italic text-gray-700 mt-1">Reading time: {props.readLength} minutes</p>
        {props.notes && <p className='text-sm text-gray-900 mt-2 mx-3'><EntryNotes notes={props.notes} /></p>}
      </div>
    )
  } else {
    return (
      <div className="p-1 mb-3">
        <FaBookOpen className="inline mr-1 text-sm align-middle text-black" /> {props.book.author} - "{props.book.title}" <span className='text-red-800 inline-block text-xs font-semibold mx-2 px-2 py-0.5 rounded-full'>{props.book.genreTag}</span>
        <p className="text-sm italic text-gray-700 mt-1">Pages read: {props.readLength}, current page: {props.currentPage}</p>
        {props.notes && <p className='text-sm text-gray-900 mt-2 mx-3'><EntryNotes notes={props.notes} /></p>}
      </div>
    )
  }
}

  

const LogBook = () => {
  const articleLogs = useSelector(state => state.articleLogs)
  const bookLogs = useSelector(state => state.bookLogs)

  const [visible, setVisible] = useState(false)
  const showWhenVisible = { display: visible ? '' : 'none' }
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const sortedLogs = articleLogs.concat(bookLogs).slice().sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  )



  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-red-800 text-4xl font-semibold text-center my-6">Reading Log</h2>
      <button 
        onClick={toggleVisibility}
        className="flex items-center gap-0.5 bg-neutral-100 hover:bg-red-700 text-red-800 border-2 border-red-800 hover:text-white font-semibold px-4 py-1 rounded mb-4">
        <AiOutlinePlus className="text-lg" />
        Add article
      </button>
      <div style={showWhenVisible}>
        <ArticleForm />
      </div>
      {groupByDate(sortedLogs).map(group => (
        <div className="mt-4" key={group.date}>
          <h3 className="text-lg font-bold text-amber-700">{group.date}</h3>
          {group.entries.map(entry => (
            <Entry key={entry.id} {...entry} />
          ))}
        </div>
      ))}
    </div>
  )
}

export default LogBook