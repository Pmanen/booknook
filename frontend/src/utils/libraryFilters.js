const isBook = item => item.pages !== undefined;

const getLength = item => (isBook(item) ? item.pages : item.length) ?? 0;

const getPublishDate = item => {
  if (isBook(item)) {
    return item.yearPublished ? new Date(`${item.yearPublished}-01-01`) : null;
  }
  return item.datePublished ? new Date(item.datePublished) : null;
};

const nullsLast = (getVal, cmp) => (a, b) => {
  const va = getVal(a);
  const vb = getVal(b);
  if (va === null && vb === null) return 0;
  if (va === null) return 1;
  if (vb === null) return -1;
  return cmp(va, vb);
};

const sortFns = {
  'latest-added': (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded),
  'earliest-added': (a, b) => new Date(a.dateAdded) - new Date(b.dateAdded),
  'author-az': nullsLast(
    item => item.author || null,
    (a, b) => a.localeCompare(b)
  ),
  'title-az': (a, b) => a.title.localeCompare(b.title),
  'length-asc': (a, b) => getLength(a) - getLength(b),
  'length-desc': (a, b) => getLength(b) - getLength(a),
  'publish-asc': nullsLast(getPublishDate, (a, b) => a - b),
  'publish-desc': nullsLast(getPublishDate, (a, b) => b - a),
  'genre-asc': nullsLast(
    item => item.genreTag ?? null,
    (a, b) => a - b
  ),
  'genre-desc': nullsLast(
    item => item.genreTag ?? null,
    (a, b) => b - a
  ),
  'outlet-az': nullsLast(
    item => item.outlet || null,
    (a, b) => a.localeCompare(b)
  ),
};

export const SORT_OPTIONS = [
  { value: 'latest-added', label: 'Latest added' },
  { value: 'earliest-added', label: 'Earliest added' },
  { value: 'author-az', label: 'Author A–Z' },
  { value: 'title-az', label: 'Title A–Z' },
  { value: 'length-asc', label: 'Length: low to high' },
  { value: 'length-desc', label: 'Length: high to low' },
  { value: 'publish-asc', label: 'Publish date: earliest first' },
  { value: 'publish-desc', label: 'Publish date: latest first' },
  { value: 'genre-asc', label: 'Genre: 0 to 99' },
  { value: 'genre-desc', label: 'Genre: 99 to 0' },
  { value: 'outlet-az', label: 'Outlet A–Z' },
];

export const DEFAULT_FILTERS = {
  includeBooks: true,
  includeArticles: true,
  genreGroups: [],
  outlet: '',
  finished: false,
  hasProgress: false,
};

export const sortLibrary = (library, sortKey) =>
  [...library].sort(sortFns[sortKey] ?? sortFns['latest-added']);

export const getFinishedBookIds = bookLogs =>
  new Set(bookLogs.filter(l => l.finished).map(l => l.book?.id ?? l.book));

export const getBooksWithProgressIds = bookLogs =>
  new Set(bookLogs.map(l => l.book?.id ?? l.book));

export const applyFilters = (library, filters, bookLogs) => {
  let result = library;

  if (!filters.includeBooks) result = result.filter(item => !isBook(item));
  if (!filters.includeArticles) result = result.filter(item => isBook(item));

  if (filters.genreGroups.length > 0) {
    result = result.filter(item => {
      if (item.genreTag === null) return false;
      return filters.genreGroups.some(
        g => item.genreTag >= g && item.genreTag < g + 10
      );
    });
  }

  if (filters.outlet.trim()) {
    const q = filters.outlet.trim().toLowerCase();
    result = result.filter(item => item.outlet?.toLowerCase().includes(q));
  }

  if (filters.finished) {
    const ids = getFinishedBookIds(bookLogs);
    result = result.filter(item => (isBook(item) ? ids.has(item.id) : true));
  }

  if (filters.hasProgress) {
    const ids = getBooksWithProgressIds(bookLogs);
    result = result.filter(item => (isBook(item) ? ids.has(item.id) : true));
  }

  return result;
};
