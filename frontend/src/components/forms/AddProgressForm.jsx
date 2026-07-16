import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { appendBookLog } from '../../reducers/bookLogReducer';

const AddProgressForm = ({ book, onClose }) => {
  const dispatch = useDispatch();
  const recentLog = useSelector(state =>
    state.bookLogs.findLast(log => log.book.id === book.id)
  );
  const [currentPage, setCurrentPage] = useState(
    recentLog ? String(recentLog.currentPage) : ''
  );

  const handleSubmit = event => {
    event.preventDefault();
    const page = Math.min(Number(currentPage), book.pages);
    dispatch(
      appendBookLog({
        book: book.id,
        currentPage: page,
        finished: page >= book.pages,
      })
    );
    onClose();
  };

  const fieldClass =
    'w-full rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-red-800 focus:outline-none';
  const labelClass =
    'mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500';

  return (
    <div className="mt-2 ml-auto max-w-xs rounded border border-gray-200 bg-neutral-50 p-4">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
        <div>
          <label className={labelClass}>
            Current page <span className="text-red-800">*</span>
          </label>
          <input
            type="number"
            min={1}
            max={book.pages}
            value={currentPage}
            onChange={e => setCurrentPage(e.target.value)}
            className={fieldClass}
            required
          />
        </div>
        <div className="col-span-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-gray-300 px-4 py-1 text-sm text-gray-600 hover:bg-neutral-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded border-2 border-red-800 bg-neutral-50 px-4 py-1 text-sm font-semibold text-red-800 hover:bg-red-700 hover:text-white"
          >
            Log progress
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProgressForm;
