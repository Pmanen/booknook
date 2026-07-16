import { useField } from '../../hooks/useField';
import { useDispatch } from 'react-redux';

import { appendBook } from '../../reducers/bookReducer';

const BookForm = () => {
  const dispatch = useDispatch();
  const titleInput = useField('text');
  const authorInput = useField('text');
  const yearPublishedInput = useField('text');
  const pagesInput = useField('text');
  const genreTagInput = useField('text');
  const currentPageInput = useField('text');

  const handleCreate = async event => {
    event.preventDefault();

    const newBook = {
      title: titleInput.input.value,
      author: authorInput.input.value,
      yearPublished: yearPublishedInput.input.value,
      pages: pagesInput.input.value,
      genreTag: genreTagInput.input.value,
      currentPage: currentPageInput.input.value,
    };
    dispatch(appendBook(newBook));

    titleInput.reset();
    authorInput.reset();
    yearPublishedInput.reset();
    pagesInput.reset();
    genreTagInput.reset();
    currentPageInput.reset();
  };

  const fieldClass =
    'w-full rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-red-800 focus:outline-none';
  const labelClass =
    'mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500';

  return (
    <div className="mb-6 rounded border border-gray-200 bg-neutral-50 p-5">
      <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
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
          <label className={labelClass}>
            Year Published <span className="text-red-800">*</span>
          </label>
          <input {...yearPublishedInput.input} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>
            Pages <span className="text-red-800">*</span>
          </label>
          <input {...pagesInput.input} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>
            Genre tag <span className="text-red-800">*</span>
          </label>
          <input {...genreTagInput.input} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>Current Page</label>
          <input {...currentPageInput.input} className={fieldClass} />
        </div>
        <div className="col-span-2 flex justify-end">
          <button className="rounded border-2 border-red-800 bg-neutral-100 px-4 py-1 font-semibold text-red-800 hover:bg-red-700 hover:text-white">
            Add book
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
