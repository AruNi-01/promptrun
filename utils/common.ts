import { format } from "date-fns";

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

export function formatStringDate(time: string | undefined): string {
  return time ? format(new Date(time), "yyyy-MM-dd HH:mm:ss") : "";
}

export function formatDate(date: Date): string {
  return format(date, "yyyy-MM-dd HH:mm:ss");
}

export function getDayDiffUtilNow(date: Date): number {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
