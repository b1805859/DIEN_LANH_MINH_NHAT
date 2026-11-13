export const AUTH_TOKEN_CHANGE_EVENT = 'minhnhat-auth-token-change';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const LOGGED_OUT_KEY = 'minhnhat_admin_logged_out';

function emitAuthTokenChange() {
  window.dispatchEvent(new Event(AUTH_TOKEN_CHANGE_EVENT));
}

export function getStoredAccessToken() {
  if (typeof window === 'undefined') {
    return '';
  }

  const stored = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  if (stored) {
    return stored;
  }

  if (window.sessionStorage.getItem(LOGGED_OUT_KEY) === '1') {
    return '';
  }

  return 'aurora-preview-admin-token';
}

export function getStoredRefreshToken() {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem(REFRESH_TOKEN_KEY) ?? 'aurora-preview-refresh-token';
}

export function setStoredAuthTokens(accessToken: string, refreshToken: string) {
  window.sessionStorage.removeItem(LOGGED_OUT_KEY);
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  emitAuthTokenChange();
}

export function clearStoredAuthTokens() {
  window.sessionStorage.setItem(LOGGED_OUT_KEY, '1');
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  emitAuthTokenChange();
}
