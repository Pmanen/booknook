import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

import './App.css';
import Library from './components/Library';
import LogBook from './components/LogBook';
import StatsDisplay from './components/StatsDisplay';
import { initializeBooks } from './reducers/bookReducer';
import { initializeArticles } from './reducers/articleReducer';
import { initializeArticleLogs } from './reducers/articleLogReducer';
import { initializeBookLogs } from './reducers/bookLogReducer';
import loginService from './services/login';
import tokenService from './services/token';
import { setUser, resetUser } from './reducers/sessionReducer';

const App = () => {
  const user = useSelector(state => state.session.username);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const location = useLocation();

  const isActive = path => location.pathname === path;

  useEffect(() => {
    if (user) {
      dispatch(initializeBooks());
      dispatch(initializeArticles());
      dispatch(initializeArticleLogs());
      dispatch(initializeBookLogs());
    }
  }, [user, dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBooknookUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user.username));
      tokenService.initializeToken();
    }
  }, [dispatch]);

  const handleLogin = async event => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBooknookUser', JSON.stringify(user));
      dispatch(setUser(user.username));
      tokenService.setToken(user.token);
      setUsername('');
      setPassword('');
    } catch {
      console.log('Login failed: wrong credentials');
    }
  };

  const logout = () => {
    window.localStorage.removeItem('loggedBooknookUser');
    dispatch(resetUser());
  };

  const fieldClass =
    'w-full rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-red-800 focus:outline-none';
  const labelClass =
    'mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500';

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-100">
        <div className="w-80 rounded border border-gray-200 bg-neutral-50 p-8">
          <h2 className="mb-6 text-center text-3xl font-semibold text-red-800">
            Booknook
          </h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Username</label>
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                className={fieldClass}
              />
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="rounded border-2 border-red-800 bg-neutral-50 px-4 py-1 font-semibold text-red-800 hover:bg-red-700 hover:text-white"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  } else
    return (
      <div className="bg-neutral-100 p-8">
        <div className="mb-6 flex h-8 items-center justify-center gap-4 text-gray-700">
          <Link
            to="/library"
            className={isActive('/library') ? 'underline' : 'hover:underline'}
          >
            Library
          </Link>
          <Link
            to="/log"
            className={isActive('/log') ? 'underline' : 'hover:underline'}
          >
            Logbook
          </Link>
          <Link
            to="/stats"
            className={isActive('/stats') ? 'underline' : 'hover:underline'}
          >
            Stats
          </Link>
          <button onClick={logout} className="rounded hover:underline">
            Logout
          </button>
        </div>

        <Routes>
          <Route path="/" element={<Library />} />
          <Route path="/stats" element={<StatsDisplay />} />
          <Route path="/library" element={<Library />} />
          <Route path="/log" element={<LogBook />} />
        </Routes>
      </div>
    );
};

export default App;
