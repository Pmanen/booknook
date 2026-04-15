import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { FaBookOpen, FaStar } from 'react-icons/fa';

import '../App.css';
import ArticleForm from './forms/ArticleForm';
import EditArticleLogForm from './forms/EditArticleLogForm';
import { removeBookLog } from '../reducers/bookLogReducer';

const groupByDate = entries => {
  const groups = [];
  let currentDate = null;

  entries.forEach(entry => {
    const dateOnly = new Date(entry.date).toISOString().split('T')[0];

    if (dateOnly !== currentDate) {
      currentDate = dateOnly;
      groups.push({ date: currentDate, entries: [] });
    }
    groups[groups.length - 1].entries.push(entry);
  });

  return groups;
};

const EntryNotes = ({ notes }) => {
  const [expanded, setExpanded] = useState(false);

  const charLimit = 600; // estimate for ~100 words
  const isLong = notes.length > charLimit;
  const truncatedNotes = isLong ? notes.substring(0, charLimit) + '...' : notes;
  const displayNotes = expanded ? notes : truncatedNotes;

  return (
    <div className="border-l-2 border-amber-600 pl-3 whitespace-pre-wrap text-gray-700">
      <div>{displayNotes}</div>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-xs text-amber-600 italic hover:text-amber-700"
        >
          {expanded ? 'show less' : 'expand'}
        </button>
      )}
    </div>
  );
};

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const Entry = props => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  if (props.article) {
    return (
      <div className="mb-3 p-1">
        {props.favorite && <FaStar className="mr-1 inline align-middle text-sm text-yellow-500" />}
        {props.article.author}{' '}
        {props.article.outlet && `(${props.article.outlet})`} - "
        <a href={props.article.url} target="_blank" rel="noopener.noreferrer">
          {props.article.title}
        </a>
        ".
        <span className="mx-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold text-red-800">
          {props.article.genreTag}
        </span>
        <button onClick={() => setIsEditing(!isEditing)} className="text-xs text-gray-500 underline hover:text-gray-800">edit</button>
        {isEditing && (
          <EditArticleLogForm log={props} onClose={() => setIsEditing(false)} />
        )}
        <p className="mt-1 text-sm text-gray-700 italic">
          Reading time: {props.readLength} minutes
        </p>
        {props.notes && (
          <div className="mx-3 mt-2 text-sm text-gray-900">
            <EntryNotes notes={props.notes} />
          </div>
        )}
      </div>
    );
  } else {
    const isRecent = Date.now() - new Date(props.date).getTime() <= THIRTY_DAYS_MS;
    const showDelete = isRecent && props.isLatestForBook;

    return (
      <div className="mb-3 p-1">
        <FaBookOpen className="mr-1 inline align-middle text-sm text-black" />{' '}
        {props.book.author} - "{props.book.title}".{' '}
        <span className="mx-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold text-red-800">
          {props.book.genreTag}
        </span>
        {showDelete && (
          <button
            onClick={() => dispatch(removeBookLog(props.id))}
            className="text-xs text-gray-500 underline hover:text-gray-800"
          >
            delete
          </button>
        )}
        <p className="mt-1 text-sm text-gray-700 italic">
          Pages read: {props.readLength}, current page: {props.currentPage}
        </p>
        {props.notes && (
          <p className="mx-3 mt-2 text-sm text-gray-900">
            <EntryNotes notes={props.notes} />
          </p>
        )}
      </div>
    );
  }
};

const LogBook = () => {
  const articleLogs = useSelector(state => state.articleLogs);
  const bookLogs = useSelector(state => state.bookLogs);

  const [visible, setVisible] = useState(false);
  const showWhenVisible = { display: visible ? '' : 'none' };
  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const latestBookLogIds = new Set(
    Object.values(
      bookLogs.reduce((acc, log) => {
        const bookId = log.book.id;
        if (!acc[bookId] || new Date(log.date) > new Date(acc[bookId].date)) {
          acc[bookId] = log;
        }
        return acc;
      }, {})
    ).map(log => log.id)
  );

  const sortedLogs = articleLogs
    .concat(bookLogs)
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="my-6 text-center text-4xl font-semibold text-red-800">
        Reading Log
      </h2>
      <button
        onClick={toggleVisibility}
        className="mb-4 flex items-center gap-0.5 rounded border-2 border-red-800 bg-neutral-100 px-4 py-1 font-semibold text-red-800 hover:bg-red-700 hover:text-white"
      >
        {visible ? <AiOutlineMinus className="text-lg" /> : <AiOutlinePlus className="text-lg" />}
        Add article
      </button>
      <div style={showWhenVisible}>
        <ArticleForm />
      </div>
      {groupByDate(sortedLogs).map(group => (
        <div className="mt-4" key={group.date}>
          <h3 className="text-lg font-bold text-amber-700">{group.date}</h3>
          {group.entries.map(entry => (
            <Entry key={entry.id} {...entry} isLatestForBook={latestBookLogIds.has(entry.id)} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default LogBook;
