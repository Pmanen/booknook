import { useState } from 'react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { DEFAULT_FILTERS } from '../utils/libraryFilters';

const GENRE_GROUPS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];

const toggleBtn = active =>
  active
    ? 'rounded border-2 border-red-800 bg-red-800 px-4 py-1 font-semibold text-white'
    : 'rounded border-2 border-neutral-300 bg-neutral-100 px-4 py-1 font-semibold text-neutral-400 hover:border-neutral-400';

const genreBtn = active =>
  active
    ? 'rounded border border-red-800 bg-red-800 px-2 py-0.5 text-sm font-semibold text-white'
    : 'rounded border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-sm font-semibold text-neutral-400 hover:border-neutral-400';

const FilterLibraryForm = ({ onApply }) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(DEFAULT_FILTERS);

  const toggle = key => setDraft(prev => ({ ...prev, [key]: !prev[key] }));

  const toggleGenre = g =>
    setDraft(prev => ({
      ...prev,
      genreGroups: prev.genreGroups.includes(g)
        ? prev.genreGroups.filter(x => x !== g)
        : [...prev.genreGroups, g],
    }));

  const handleClear = () => {
    setDraft(DEFAULT_FILTERS);
    onApply(DEFAULT_FILTERS);
  };

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-sm font-semibold text-red-800 hover:text-red-600"
      >
        {open
          ? <FiChevronDown className="text-base" />
          : <FiChevronRight className="text-base" />}
        Filter library
      </button>

      {open && (
        <div className="mt-2 rounded border border-neutral-200 bg-neutral-50 p-4">
          <div className="mb-3">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">Show</p>
            <div className="flex gap-2">
              <button onClick={() => toggle('includeBooks')} className={toggleBtn(draft.includeBooks)}>
                Books
              </button>
              <button onClick={() => toggle('includeArticles')} className={toggleBtn(draft.includeArticles)}>
                Articles
              </button>
            </div>
          </div>

          <div className="mb-3">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">Genre group</p>
            <div className="flex flex-wrap gap-1.5">
              {GENRE_GROUPS.map(g => (
                <button key={g} onClick={() => toggleGenre(g)} className={genreBtn(draft.genreGroups.includes(g))}>
                  {String(g).padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">Outlet</p>
            <input
              type="text"
              value={draft.outlet}
              onChange={e => setDraft(prev => ({ ...prev, outlet: e.target.value }))}
              placeholder="Filter by outlet…"
              className="w-full rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm focus:border-red-800 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">Special filters</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => toggle('finished')} className={toggleBtn(draft.finished)}>
                Finished
              </button>
              <button onClick={() => toggle('hasProgress')} className={toggleBtn(draft.hasProgress)}>
                Has reading progress
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onApply(draft)}
              className="rounded border-2 border-red-800 bg-red-800 px-4 py-1 font-semibold text-white hover:bg-red-700"
            >
              Filter
            </button>
            <button
              onClick={handleClear}
              className="rounded border-2 border-neutral-300 bg-neutral-100 px-4 py-1 font-semibold text-neutral-500 hover:bg-neutral-200"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterLibraryForm;
