import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const UserTypes = {
  COMMON_USER: 0,
  SELLER_USER: 1,
};

interface ILoginUser {
  id: number;
  email: string;
  password: string;
  nickname: string;
  headerUrl: string;
  type: number;
  createTime: string;
}

interface ILoginUserState {
  loginUser: ILoginUser | null;
  setLoginUser: (user: ILoginUser) => void;
  removeLoginUser: () => void;
}

export const useLoginUserStore = create(
  persist<ILoginUserState>(
    (set) => ({
      loginUser: null,
      setLoginUser: (user: ILoginUser) => set({ loginUser: user }),
      removeLoginUser: () => set({ loginUser: null }),
    }),
    {
      name: "login-user", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
