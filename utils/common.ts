export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getCookieValue(cookieName: string): string | null {
  const cookieString = document.cookie;
  const cookies = cookieString.split("; ");

  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === cookieName) {
      return decodeURIComponent(value);
    }
  }

  return null;
}

export function checkIsLogin(code: number): boolean {
  if (code === 401) {
    return false;
  } else {
    return true;
  }
}
