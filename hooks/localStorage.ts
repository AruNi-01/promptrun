
export const useLocalStorageWithLoginUser = (key: string) => {
  const loginUser = () => {
    const local = localStorage.getItem(key);

    if (local != null) {
      return JSON.parse(local);
    }

    return null;
  };

  const setLocalStorage = (item: any) => {
    localStorage.setItem(key, JSON.stringify(item));
  };

  const removeLocalStorage = () => {
    return localStorage.removeItem(key);
  };

  return [loginUser, setLocalStorage, removeLocalStorage];
};
