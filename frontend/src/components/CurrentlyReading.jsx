import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  const [updatePage, setUpdatePage] = useState(log.currentPage);
  const [updatePercentage, setUpdatePercentage] = useState(
    Math.round(log.percentRead)
  );

  const showWhenVisible = { display: visible ? '' : 'none' };
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
    <div>
      {log.book.title}: page {log.currentPage} of {log.book.pages} (
      {Math.round(log.percentRead)}%)
      <span>
        <button onClick={toggleVisibility}>Edit</button>
      </span>
      <div style={showWhenVisible}>
        <form onSubmit={handleUpdate}>
          <label>
            page:
            <input
              type="text"
              value={updatePage}
              onChange={({ target }) => setUpdatePage(target.value)}
            />
          </label>
          <button type="submit">Save</button>
        </form>
        <form onSubmit={handlePercentageUpdate}>
          <label>
            %:
            <input
              type="text"
              value={updatePercentage}
              onChange={({ target }) => setUpdatePercentage(target.value)}
            />
          </label>
          <button type="submit">Save</button>
        </form>
        <button onClick={handleFinished}>Mark finished</button>
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
      <h3>Currently reading</h3>
      {recentBooks.map(log => (
        <BookStatusItem key={log.id} log={log} />
      ))}
    </div>
  );
};

export default CurrentlyReading;
