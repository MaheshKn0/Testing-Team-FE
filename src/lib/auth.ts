const SESSION_KEY = "testtools_session_v1";
const VALID_USERNAME = "Imeuswe@Testing";
const VALID_PASSWORD = "Testing@2026";

export function attemptLogin(username: string, password: string): boolean {
  const ok =  username.trim().toLowerCase() === VALID_USERNAME.toLowerCase() && password === VALID_PASSWORD;
  console.log(ok)
  if (ok) {
    const token = btoa(`${username}:${Date.now()}`);
    sessionStorage.setItem(SESSION_KEY, token);
  }
  return ok;
}

export function isLoggedIn(): boolean {
  return Boolean(sessionStorage.getItem(SESSION_KEY));
}

export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
