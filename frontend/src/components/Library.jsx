import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { FiBook } from 'react-icons/fi';
import { IoDocumentTextOutline } from 'react-icons/io5';
import CurrentlyReading from './CurrentlyReading';
import DropdownMenu from './DropdownMenu';
import BookForm from './forms/BookForm';
import EditBookForm from './forms/EditBookForm';
import AddProgressForm from './forms/AddProgressForm';
import '../App.css';
import { removeBook } from '../reducers/bookReducer';

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
          <span className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold text-red-800">
            {book.genreTag}
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

const ArticleEntry = props => (
  <li className="mb-1 p-1">
    <IoDocumentTextOutline className="mr-1 inline align-middle text-sm text-black" />
    {props.author}
    {props.outlet && ` (${props.outlet})`}, &ldquo;
    <a href={props.url} target="_blank" rel="noopener noreferrer">
      {props.title}
    </a>
    &rdquo;.
    <span className="mx-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold text-red-800">
      {props.genreTag}
    </span>
  </li>
);

const Library = () => {
  const books = useSelector(state => state.books);
  const articles = useSelector(state => state.articles);
  const library = books
    .concat(articles)
    .slice()
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

  const [visible, setVisible] = useState(false);
  const showWhenVisible = { display: visible ? '' : 'none' };
  const toggleVisibility = () => setVisible(!visible);

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="my-6 text-center text-4xl font-semibold text-red-800">Library</h2>
      <CurrentlyReading />
      <div className="mt-6">
        <h3 className="my-3 text-center text-2xl font-semibold text-amber-700">All books and articles</h3>
        <button
          onClick={toggleVisibility}
          className="mb-4 flex items-center gap-0.5 rounded border-2 border-red-800 bg-neutral-100 px-4 py-1 font-semibold text-red-800 hover:bg-red-700 hover:text-white"
        >
          {visible ? <AiOutlineMinus className="text-lg" /> : <AiOutlinePlus className="text-lg" />}
          Add book
        </button>
        <div style={showWhenVisible}>
          <BookForm />
        </div>
        <ul>
          {library.map(document =>
            document.pages
              ? <BookEntry key={document.id} book={document} />
              : <ArticleEntry key={document.id} {...document} />
          )}
        </ul>
      </div>
    </div>
  );
};

export default Library;
