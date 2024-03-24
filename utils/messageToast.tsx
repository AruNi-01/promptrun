import toast from "react-hot-toast";

export const toastSuccessMsg = (message: string, duration?: number) => {
  toast.success(message, {
    duration: duration ? duration : 4000,
    style: {
      borderRadius: "10px",
      background: "#222",
      color: "#fff",
    },
  });
};

export const toastErrorMsg = (message: string, duration?: number) => {
  toast.error(message, {
    duration: duration ? duration : 4000,
    style: {
      borderRadius: "10px",
      background: "#444",
      color: "#fff",
    },
  });
};
