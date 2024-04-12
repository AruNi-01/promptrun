import { toast } from "sonner";

export const toastSuccessMsg = (message: string, duration?: number) => {
  toast.success(message);
};

export const toastErrorMsg = (message: string, duration?: number) => {
  toast.error(message);
};

export const toastInfoMsg = (message: string, duration?: number) => {
  toast.info(message);
};
