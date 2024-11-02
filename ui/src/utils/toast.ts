import { toast } from "react-toastify";

export const ToastOnSuccess = (msg: string) => {
  toast.success(msg);
  return;
};

export const ToastOnFailure = (msg: string) => {
  toast.error(msg);
  return;
};