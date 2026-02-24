import { useSelector } from 'react-redux';
import CurrentlyReading from './CurrentlyReading';

const LibraryEntry = props => {
  if (props.pages) {
    return (
      <p key={props.id}>
        {props.author}, "{props.title}". ({props.genreTag})
      </p>
    );
  } else {
    return (
      <p key={props.id}>
        {props.author} ({props.outlet}), "{props.title}". ({props.genreTag})
      </p>
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

  return (
    <div>
      <h2>Library</h2>
      <CurrentlyReading />
      <h3>All books and articles</h3>
      {library.map(document => (
        <LibraryEntry key={document.id} {...document} />
      ))}
    </div>
  );
};

export default Library;
