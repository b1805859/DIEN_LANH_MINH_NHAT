export const AUTH_TOKEN_CHANGE_EVENT = 'minhnhat-auth-token-change';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

function emitAuthTokenChange() {
  window.dispatchEvent(new Event(AUTH_TOKEN_CHANGE_EVENT));
}

export function getStoredAccessToken() {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY) ?? '';
}

export function getStoredRefreshToken() {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem(REFRESH_TOKEN_KEY) ?? '';
}

export function setStoredAuthTokens(accessToken: string, refreshToken: string) {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  emitAuthTokenChange();
}

export function clearStoredAuthTokens() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  emitAuthTokenChange();
}
