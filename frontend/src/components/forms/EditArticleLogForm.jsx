import { useState } from 'react';
import { useField } from '../../hooks/useField';
import { useDispatch } from 'react-redux';

import { editArticleLog } from '../../reducers/articleReducer';

const EditArticleLogForm = ({ log, onClose }) => {
  const dispatch = useDispatch();
  const titleInput = useField('text', log.article.title);
  const authorInput = useField('text', log.article.author);
  const outletInput = useField('text', log.article.outlet);
  const urlInput = useField('text', log.article.url);
  const datePublishedInput = useField(
    'date',
    new Date(log.article.datePublished).toISOString().split('T')[0]
  );
  const lengthInput = useField('number', Number(log.readLength));
  const genreTagInput = useField('text', log.article.genreTag);
  const [notes, setNotes] = useState(log.notes);
  const [isFavorite, setIsFavorite] = useState(log.favorite);

  const compareArticlesandLogs = (newArticle, newLog) => {
    return (
      newArticle.title === log.article.title &&
      newArticle.author === log.article.author &&
      newArticle.outlet === log.article.outlet &&
      newArticle.url === log.article.url &&
      newArticle.length === log.readLength &&
      newArticle.datePublished ===
        new Date(log.article.datePublished).toISOString().split('T')[0] &&
      newArticle.genreTag === log.article.genreTag &&
      newLog.notes === log.notes &&
      newLog.favorite === log.favorite
    );
  };

  const handleUpdate = async event => {
    event.preventDefault();

    const newArticle = {
      id: log.article.id,
      title: titleInput.input.value,
      author: authorInput.input.value,
      outlet: outletInput.input.value,
      url: urlInput.input.value,
      length: lengthInput.input.value,
      datePublished: datePublishedInput.input.value,
      genreTag: genreTagInput.input.value,
    };
    const newLog = {
      id: log.id,
      date: log.date,
      notes,
      favorite: isFavorite,
    };
    if (!compareArticlesandLogs(newArticle, newLog)) {
      dispatch(editArticleLog(newArticle, newLog));
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
        <div className="flex items-center pt-5">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={isFavorite}
              onChange={e => setIsFavorite(e.target.checked)}
              className="accent-red-800"
            />
            Favorite
          </label>
        </div>
        <div className="col-span-2">
          <label className={labelClass}>Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className={`${fieldClass} resize-y`}
            rows={6}
            placeholder="Thoughts, quotes, takeaways…"
          />
        </div>
        <div className="col-span-2 flex justify-end">
          <button className="rounded border-2 border-red-800 bg-neutral-100 px-4 py-1 font-semibold text-red-800 hover:bg-red-700 hover:text-white">
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditArticleLogForm;
