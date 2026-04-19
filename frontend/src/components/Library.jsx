import { useSelector, useDispatch } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { FiBook, FiChevronDown } from 'react-icons/fi';
import { IoDocumentTextOutline } from 'react-icons/io5';
import CurrentlyReading from './CurrentlyReading';
import DropdownMenu from './DropdownMenu';
import BookForm from './forms/BookForm';
import ArticleForm from './forms/ArticleForm';
import EditBookForm from './forms/EditBookForm';
import EditArticleForm from './forms/EditArticleForm';
import AddProgressForm from './forms/AddProgressForm';
import FilterLibraryForm from './forms/FilterLibraryForm';
import '../App.css';
import { removeBook } from '../reducers/bookReducer';
import { removeArticle } from '../reducers/articleReducer';
import { deweyText } from '../utils/deweyTags';
import { SORT_OPTIONS, DEFAULT_FILTERS, sortLibrary, applyFilters } from '../utils/libraryFilters';

const SortDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentLabel = SORT_OPTIONS.find(o => o.value === value)?.label ?? '';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-stretch overflow-hidden rounded border-2 border-red-800"
      >
        <span className="bg-neutral-100 px-3 py-1 text-sm font-semibold text-red-800">
          {currentLabel}
        </span>
        <span className="flex items-center bg-red-800 px-2 text-white">
          <FiChevronDown className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>
      {open && (
        <ul className="absolute right-0 z-20 mt-1 min-w-full overflow-hidden rounded border border-neutral-200 bg-white shadow-md">
          {SORT_OPTIONS.map(opt => (
            <li key={opt.value}>
              <button
                className={`w-full px-3 py-1.5 text-left text-sm hover:bg-neutral-100 ${
                  opt.value === value ? 'font-semibold text-red-800' : 'text-neutral-700'
                }`}
                onClick={() => { onChange(opt.value); setOpen(false); }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const BookEntry = ({ book }) => {
  const dispatch = useDispatch();
  const [activeForm, setActiveForm] = useState(null); // null | 'edit' | 'addProgress'

  const toggle = form => setActiveForm(prev => (prev === form ? null : form));

  const menuItems = [
    { label: 'Add progress', onClick: () => toggle('addProgress') },
    { label: 'Edit', onClick: () => toggle('edit') },
    {
      label: 'Delete',
      danger: true,
      onClick: () => {
        if (window.confirm(`Delete "${book.title}"?`)) {
          dispatch(removeBook(book.id));
        }
      },
    },
  ];

  return (
    <li className="mb-1 p-1">
      <div className="flex items-center justify-between gap-2">
        <div>
          <FiBook className="mr-1 inline align-middle text-sm text-black" />
          {book.author}, &ldquo;{book.title}&rdquo;.
          <span className="relative group cursor-default inline-block">
            <span className="rounded-full px-2 py-0.5 text-xs font-semibold text-red-800">
              {book.genreTag}
            </span>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-10">
              {deweyText(book.genreTag)}
            </span>
          </span>
        </div>
        <DropdownMenu items={menuItems} />
      </div>
      {activeForm === 'addProgress' && (
        <AddProgressForm book={book} onClose={() => setActiveForm(null)} />
      )}
      {activeForm === 'edit' && (
        <EditBookForm book={book} onClose={() => setActiveForm(null)} />
      )}
    </li>
  );
};

const ArticleEntry = ({ article }) => {
  const dispatch = useDispatch();
  const [activeForm, setActiveForm] = useState(false);

  const menuItems = [
    { label: 'Edit', onClick: () => setActiveForm(!activeForm) },
    {
      label: 'Delete',
      danger: true,
      onClick: () => {
        if (window.confirm(`Delete "${article.title}"?`)) {
          dispatch(removeArticle(article.id));
        }
      },
    },
  ];

  return (
    <li className="mb-1 p-1">
      <div className="flex items-center justify-between gap-2">
        <div>
          <IoDocumentTextOutline className="mr-1 inline align-middle text-sm text-black" />
          {article.author}
          {article.outlet && ` (${article.outlet})`}, &ldquo;
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
          &rdquo;.
          <span className="mx-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold text-red-800">
            {article.genreTag}
          </span>
        </div>
        <DropdownMenu items={menuItems} />
      </div>
      {activeForm && (
        <EditArticleForm article={article} onClose={() => setActiveForm(false)} />
      )}
    </li>
  );
};

const Library = () => {
  const books = useSelector(state => state.books);
  const articles = useSelector(state => state.articles);
  const bookLogs = useSelector(state => state.bookLogs);

  const [sortKey, setSortKey] = useState('latest-added');
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);

  const [visibleBookForm, setVisibleBookForm] = useState(false);
  const showBookFormWhenVisible = { display: visibleBookForm ? '' : 'none' };
  const [visibleArticleForm, setVisibleArticleForm] = useState(false);
  const showArticleFormWhenVisible = { display: visibleArticleForm ? '' : 'none' };

  const combinedLibrary = books.concat(articles);
  const sortedLibrary = sortLibrary(combinedLibrary, sortKey);
  const filteredLibrary = applyFilters(sortedLibrary, appliedFilters, bookLogs);

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="my-6 text-center text-4xl font-semibold text-red-800">Library</h2>
      <CurrentlyReading />
      <div className="mt-6">
        <h3 className="my-3 text-center text-2xl font-semibold text-amber-700">
          All books and articles ({filteredLibrary.length})
        </h3>
        <div className="flex gap-4">
          <button
            onClick={() => { setVisibleBookForm(!visibleBookForm); setVisibleArticleForm(false); }}
            className="mb-4 flex items-center gap-0.5 rounded border-2 border-red-800 bg-neutral-100 px-4 py-1 font-semibold text-red-800 hover:bg-red-700 hover:text-white"
          >
            {visibleBookForm ? <AiOutlineMinus className="text-lg" /> : <AiOutlinePlus className="text-lg" />}
            Add book
          </button>
          <button
            onClick={() => { setVisibleArticleForm(!visibleArticleForm); setVisibleBookForm(false); }}
            className="mb-4 flex items-center gap-0.5 rounded border-2 border-red-800 bg-neutral-100 px-4 py-1 font-semibold text-red-800 hover:bg-red-700 hover:text-white"
          >
            {visibleArticleForm ? <AiOutlineMinus className="text-lg" /> : <AiOutlinePlus className="text-lg" />}
            Add read article
          </button>
        </div>

        <div style={showBookFormWhenVisible}>
          <BookForm />
        </div>
        <div style={showArticleFormWhenVisible}>
          <ArticleForm />
        </div>

        <div className="mb-3 flex items-start justify-between gap-4">
          <FilterLibraryForm onApply={setAppliedFilters} />
          <SortDropdown value={sortKey} onChange={setSortKey} />
        </div>

        {filteredLibrary.length === 0 ? (
          <p className="italic text-neutral-500">No results with active filters</p>
        ) : (
          <ul>
            {filteredLibrary.map(document =>
              document.pages
                ? <BookEntry key={document.id} book={document} />
                : <ArticleEntry key={document.id} article={document} />
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Library;
