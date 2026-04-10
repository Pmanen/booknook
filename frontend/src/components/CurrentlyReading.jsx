import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaPencilAlt } from "react-icons/fa";
import { appendBookLog } from '../reducers/bookLogReducer';

const getRecentBooks = (bookLogs, count) => {
  const seenBookIds = new Set();
  const result = [];

  for (const log of bookLogs) {
    if (seenBookIds.has(log.book.id)) {
      continue;
    }

    if (log.finished) {
      seenBookIds.add(log.book.id);
      continue;
    }

    const percentRead = (log.currentPage / log.book.pages) * 100;
    result.push({ ...log, percentRead });
    seenBookIds.add(log.book.id);

    if (result.length === count) {
      break;
    }
  }

  return result;
};

const BookStatusItem = ({ log }) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [confirmingFinished, setConfirmingFinished] = useState(false);
  const [updatePage, setUpdatePage] = useState(log.currentPage);
  const [updatePercentage, setUpdatePercentage] = useState(
    Math.round(log.percentRead)
  );

  const showWhenVisible = { display: visible ? '' : 'none' };
  const showWhenConfirming = { display: confirmingFinished ? '' : 'none' };
  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleUpdate = async event => {
    event.preventDefault();

    const newLog = {
      book: log.book.id,
      currentPage: Math.min(updatePage, log.book.pages),
      finished: updatePage >= log.book.pages,
    };
    dispatch(appendBookLog(newLog));
    setVisible(!visible);
  };

  const handlePercentageUpdate = async event => {
    event.preventDefault();

    if (Number(updatePercentage)) {
      const newPage = Math.floor(
        (log.book.pages * Math.floor(updatePercentage)) / 100
      );
      const newLog = {
        book: log.book.id,
        currentPage: Math.min(newPage, log.book.pages),
        finished: newPage >= log.book.pages,
      };
      dispatch(appendBookLog(newLog));
      setVisible(!visible);
    }
  };

  const handleFinished = async event => {
    event.preventDefault();

    const newLog = {
      book: log.book.id,
      currentPage: log.book.pages,
      finished: true,
    };
    dispatch(appendBookLog(newLog));
    setVisible(!visible);
  };

  return (
    <div className="mx-auto max-w-150 my-4 px-5 py-4 border border-gray-200 shadow-sm rounded-lg bg-gray-50">
      <h3 className="font-semibold">{log.book.title}</h3>
      <p className="mt-0.5 text-sm italic text-gray-500">
        {log.book.author} · {log.book.yearPublished} · {log.book.genreTag}
      </p>

      <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
        <span>p. {log.currentPage} / {log.book.pages}</span>
        <span className="text-gray-400">({Math.round(log.percentRead)}%)</span>
        <button onClick={toggleVisibility}>
          <FaPencilAlt className="ml-0.5 inline align-middle text-xs text-red-800 opacity-60 hover:opacity-100" />
        </button>
      </div>

      <div style={showWhenVisible} className="mt-3">
        <div className="flex items-center gap-5">
          <form onSubmit={handleUpdate} className="flex items-center gap-1.5">
            <label className="text-xs text-gray-400">page</label>
            <input
              className="w-16 rounded border border-gray-300 px-2 py-0.5 text-center text-sm"
              type="text"
              value={updatePage}
              onChange={({ target }) => setUpdatePage(target.value)}
            />
            <button type="submit" className="text-xs text-gray-500 underline hover:text-gray-800">
              update
            </button>
          </form>

          <form onSubmit={handlePercentageUpdate} className="flex items-center gap-1.5">
            <label className="text-xs text-gray-400">%</label>
            <input
              className="w-14 rounded border border-gray-300 px-2 py-0.5 text-center text-sm"
              type="text"
              value={updatePercentage}
              onChange={({ target }) => setUpdatePercentage(target.value)}
            />
            <button type="submit" className="text-xs text-gray-500 underline hover:text-gray-800">
              update
            </button>
          </form>
        </div>

        <div className="mt-3 border-t border-gray-200 pt-3">
          <button
            onClick={() => setConfirmingFinished(!confirmingFinished)}
            className="rounded border border-red-800/40 px-3 py-1 text-xs tracking-wide text-red-800 hover:bg-red-800/5"
          >
            Mark finished
          </button>
          <div style={showWhenConfirming} className="mt-2 rounded border border-red-800/40 bg-red-50 p-3 flex gap-2">
            <p className="self-center text-sm text-gray-900 mr-3">
              Sure?
            </p>
            <button
              onClick={handleFinished}
              className="rounded border border-red-800/40 px-3 py-1 text-xs tracking-wide text-red-800 hover:bg-red-800/5"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirmingFinished(false)}
              className="rounded border border-gray-300 px-3 py-1 text-xs tracking-wide text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CurrentlyReading = () => {
  const bookLogs = useSelector(state => state.bookLogs);
  const sortedBookLogs = bookLogs
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const recentBooks = getRecentBooks(sortedBookLogs, 10);

  return (
    <div>
      <h3 className="my-3 text-2xl text-center font-semibold text-amber-700">Currently reading</h3>
      {recentBooks.map(log => (
        <BookStatusItem key={log.id} log={log} />
      ))}
    </div>
  );
};

export default CurrentlyReading;
