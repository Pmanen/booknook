import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

import './App.css';
import Library from './components/Library';
import LogBook from './components/Logbook';
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
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch();
  const location = useLocation();

  const isActive = path => location.pathname === path;

  useEffect(() => {
    dispatch(initializeBooks());
    dispatch(initializeArticles());
    dispatch(initializeArticleLogs());
    dispatch(initializeBookLogs());
  }, [dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBooknookUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user.username))
      tokenService.initializeToken();
    }
  }, [dispatch]);

  const handleLogin = async event => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBooknookUser', JSON.stringify(user));
      dispatch(setUser(user.username));
      tokenService.setToken(user.token)
      setUsername('');
      setPassword('');
    } catch {
      console.log('Login failed: wrong credentials')
    }
  };

  const logout = () => {
    window.localStorage.removeItem('loggedBooknookUser');
    dispatch(resetUser())
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="text"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">Login</button>
    </form>
  );

  if (!user) {
    return (
      <div className="bg-neutral-100 p-8">
        <h2 className="mb-4 text-2xl font-bold text-gray-700">Login</h2>
        {loginForm()}
      </div>
    );
  }

  else return (
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
          to="/"
          className={isActive('/') ? 'underline' : 'hover:underline'}
        >
          Stats
        </Link>
        <button
          onClick={logout}
          className="ml-auto rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <Routes>
        <Route path="/" element={<StatsDisplay />} />
        <Route path="/library" element={<Library />} />
        <Route path="/log" element={<LogBook />} />
      </Routes>
    </div>
  );
};

export default App;
