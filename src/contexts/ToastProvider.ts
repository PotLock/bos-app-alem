import { createContext } from "alem";

export interface ToastProps {
  title: string;
  description: string;
  type?: "success" | "error" | "warning";
}

export interface ToastContextProps {
  toast: (newValue: ToastProps) => void;
  toastContent: ToastProps;
}

const ToastProvider = () => {
  // Create a provider using a reference key
  const { setDefaultData, updateData, getSelf } = createContext<ToastContextProps>("toast-notification");

  const EMPTY_TOAST = {
    title: "",
    description: "",
  };

  setDefaultData({
    toastContent: EMPTY_TOAST,
    toast: (toastContent: ToastProps) => {
      updateData({
        toastContent,
      });
      setTimeout(() => {
        updateData({
          toastContent: EMPTY_TOAST,
        });
        // Wait 7sec before clearing the notification
      }, 7000);
    },
  });

  return getSelf();
};

export default ToastProvider;
