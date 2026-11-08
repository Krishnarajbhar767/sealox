export interface AdminUser {
  id?: number;
  username: string;
  email?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
}

const TOKEN_KEY = 'sealox_admin_token';
const USER_KEY = 'sealox_admin_user';

function safeStorage(): Storage | null {
  try {
    if (
      typeof window !== 'undefined' &&
      window.localStorage &&
      typeof window.localStorage.getItem === 'function'
    ) {
      return window.localStorage;
    }
  } catch {
    return null;
  }
  return null;
}

export function getAdminToken(): string | null {
  const storage = safeStorage();
  return storage ? storage.getItem(TOKEN_KEY) : null;
}

export function getAdminUser(): AdminUser | null {
  const storage = safeStorage();
  if (!storage) return null;
  const userJson = storage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

export function setAdminSession(token: string, user: AdminUser): void {
  const storage = safeStorage();
  if (!storage) return;
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAdminSession(): void {
  const storage = safeStorage();
  if (!storage) return;
  storage.removeItem(TOKEN_KEY);
  storage.removeItem(USER_KEY);
}

export function isAdminAuthenticated(): boolean {
  return Boolean(getAdminToken());
}
