const KEY = 'token';

export function getToken () {
  return localStorage.getItem(KEY);
}

export function setToken(token) {
  return localStorage.setItem(KEY, token);
}

export function removeToken() {
  return localStorage.removeItem(KEY);
}