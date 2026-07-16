import { useState, useEffect, useRef } from 'react';
import { BsThreeDots } from 'react-icons/bs';

const DropdownMenu = ({ items }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="rounded p-1 text-gray-400 hover:bg-neutral-200 hover:text-gray-600"
        aria-label="Open menu"
      >
        <BsThreeDots />
      </button>
      {open && (
        <ul className="absolute right-0 z-10 mt-1 w-40 rounded border border-gray-200 bg-white shadow-sm">
          {items.map(item => (
            <li key={item.label}>
              <button
                onClick={() => {
                  item.onClick();
                  setOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 ${item.danger ? 'text-red-700 hover:bg-red-50' : 'text-gray-700'}`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
