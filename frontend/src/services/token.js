let token = null;

const setToken = newToken => {
  token = `Bearer ${newToken}`;
};

const getToken = () => {
  return token;
};

const initializeToken = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedBooknookUser');
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON);
    setToken(user.token);
  }
};

export default { setToken, getToken, initializeToken };
