import { useField } from '../../hooks/useField';
import { useDispatch } from 'react-redux';
import { modifyBook } from '../../reducers/bookReducer';

const EditBookForm = ({ book, onClose }) => {
  const dispatch = useDispatch();
  const titleInput = useField('text', book.title);
  const authorInput = useField('text', book.author ?? '');
  const yearPublishedInput = useField('text', book.yearPublished ?? '');
  const pagesInput = useField('text', String(book.pages));
  const genreTagInput = useField('text', book.genreTag ?? '');

  const compareBooks = updated => {
    return (
      updated.title === book.title &&
      updated.author === book.author &&
      updated.yearPublished === book.yearPublished &&
      updated.pages === String(book.pages) &&
      updated.genreTag === book.genreTag
    );
  }

  const handleUpdate = async event => {
    event.preventDefault();
    const updated = {
      id: book.id,
      title: titleInput.input.value,
      author: authorInput.input.value,
      yearPublished: yearPublishedInput.input.value,
      pages: pagesInput.input.value,
      genreTag: genreTagInput.input.value,
    };
    if (!compareBooks(updated)) {
      dispatch(modifyBook(updated));
    }
    onClose();
  };

  const fieldClass =
    'w-full rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-red-800 focus:outline-none';
  const labelClass =
    'mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500';

  return (
    <div className="mt-2 rounded border border-gray-200 bg-neutral-50 p-4">
      <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>
            Title <span className="text-red-800">*</span>
          </label>
          <input {...titleInput.input} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>Author</label>
          <input {...authorInput.input} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>Year Published</label>
          <input {...yearPublishedInput.input} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>
            Pages <span className="text-red-800">*</span>
          </label>
          <input {...pagesInput.input} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>Genre tag</label>
          <input {...genreTagInput.input} className={fieldClass} />
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
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBookForm;
