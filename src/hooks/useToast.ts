import { useContext } from "alem";
import { ToastContextProps } from "@app/contexts/ToastProvider";

export const useToastNotification = () => useContext<ToastContextProps>("toast-notification");
