import { useLoginUserStore } from "@/state_stores/loginUserStore";
import { toastErrorMsg } from "./messageToast";
import { useRouter } from "next/navigation";

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
    const { removeLoginUser } = useLoginUserStore((state) => ({
      removeLoginUser: state.removeLoginUser,
    }));
    const router = useRouter();

    removeLoginUser();
    router.refresh();
    toastErrorMsg("您未登录，请登录后再操作");
    return false;
  } else {
    return true;
  }
}
