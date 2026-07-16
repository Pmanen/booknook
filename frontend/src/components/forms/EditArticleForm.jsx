import { useField } from '../../hooks/useField';
import { useDispatch } from 'react-redux';

import { editArticle } from '../../reducers/articleReducer';

const EditArticleForm = ({ article, onClose }) => {
  const dispatch = useDispatch();
  const titleInput = useField('text', article.title);
  const authorInput = useField('text', article.author);
  const outletInput = useField('text', article.outlet);
  const urlInput = useField('text', article.url);
  const datePublishedInput = useField(
    'date',
    new Date(article.datePublished).toISOString().split('T')[0]
  );
  const lengthInput = useField('number', Number(article.length));
  const genreTagInput = useField('text', article.genreTag);

  const compareArticles = newArticle => {
    return (
      newArticle.title === article.title &&
      newArticle.author === article.author &&
      newArticle.outlet === article.outlet &&
      newArticle.url === article.url &&
      newArticle.length === article.length &&
      newArticle.datePublished ===
        new Date(article.datePublished).toISOString().split('T')[0] &&
      newArticle.genreTag === article.genreTag
    );
  };

  const handleUpdate = async event => {
    event.preventDefault();

    const newArticle = {
      id: article.id,
      title: titleInput.input.value,
      author: authorInput.input.value,
      outlet: outletInput.input.value,
      url: urlInput.input.value,
      length: lengthInput.input.value,
      datePublished: datePublishedInput.input.value,
      genreTag: genreTagInput.input.value,
    };
    if (!compareArticles(newArticle)) {
      dispatch(editArticle(newArticle));
    }
    onClose();
  };

  const fieldClass =
    'w-full rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-red-800 focus:outline-none';
  const labelClass =
    'mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500';

  return (
    <div className="mb-6 rounded border border-gray-200 bg-neutral-50 p-5">
      <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-4">
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
          <label className={labelClass}>Outlet</label>
          <input {...outletInput.input} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>
            URL <span className="text-red-800">*</span>
          </label>
          <input {...urlInput.input} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>Date published</label>
          <input {...datePublishedInput.input} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>
            Length in minutes <span className="text-red-800">*</span>
          </label>
          <input {...lengthInput.input} className={fieldClass} />
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

export default EditArticleForm;
