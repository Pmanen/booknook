import { useSelector } from 'react-redux';
import { useState } from 'react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { FiBook } from "react-icons/fi";
import { IoDocumentTextOutline } from "react-icons/io5";
import CurrentlyReading from './CurrentlyReading';
import '../App.css';
import BookForm from './BookForm';

const LibraryEntry = props => {
  if (props.pages) {
    return (
      <li key={props.id} className="mb-1 p-1">
        <FiBook className="mr-1 inline align-middle text-sm text-black" /> 
        {props.author}, "{props.title}".
        <span className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold text-red-800">
          {props.genreTag}
        </span>
      </li>
    );
  } else {
    return (
      <li key={props.id} className="mb-1 p-1">
        <IoDocumentTextOutline className="mr-1 inline align-middle text-sm text-black" /> 
        {props.author}
        {props.outlet && ` (${props.outlet})`}, "
        <a href={props.url} target="_blank" rel="noopener.noreferrer">
          {props.title}
        </a>
        ".
        <span className="mx-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold text-red-800">
          {props.genreTag}
        </span>
      </li>
    );
  }
};

const Library = () => {
  const books = useSelector(state => state.books);
  const articles = useSelector(state => state.articles);
  const library = books
    .concat(articles)
    .slice()
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

  
  const [visible, setVisible] = useState(false);
  const showWhenVisible = { display: visible ? '' : 'none' };
  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="my-6 text-center text-4xl font-semibold text-red-800">Library</h2>
      <CurrentlyReading />
      <div className="mt-6">
        <h3 className="my-3 text-2xl text-center font-semibold text-amber-700">All books and articles</h3>
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
          {library.map(document => (
          <LibraryEntry key={document.id} {...document} />
        ))}  
        </ul>

      </div>

    </div>
  );
};

export default Library;
