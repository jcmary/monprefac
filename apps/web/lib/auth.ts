export function setToken(token: string) {
  localStorage.setItem('monprefac_token', token);
}

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('monprefac_token');
}

export function setUser(user: any) {
  localStorage.setItem('monprefac_user', JSON.stringify(user));
}

export function getUser() {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('monprefac_user');
  return user ? JSON.parse(user) : null;
}

export function removeToken() {
  localStorage.removeItem('monprefac_token');
  localStorage.removeItem('monprefac_user');
}

export function isAuthenticated() {
  return !!getToken();
}