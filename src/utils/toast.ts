import { t } from "i18next";
import {
  Bounce,
  toast,
  ToastOptions as ToastOptions_TP,
  ToastPosition,
} from "react-toastify";

const toastOptions: ToastOptions_TP = {
  position: "top-right" as ToastPosition,
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};

const STYLES = {
  success:
    "bg-success-500 text-white border border-success-600 shadow-lg rounded-xl p-4 flex items-center gap-2",
  error:
    "bg-error-500 text-white border border-error-600 shadow-lg rounded-xl p-4 flex items-center gap-2",
  info: "bg-blue-light-500 text-white border border-blue-light-600 shadow-lg rounded-xl p-4 flex items-center gap-2",
  loading:
    "bg-brand-500 text-white border border-brand-600 shadow-lg rounded-xl p-4 flex items-center gap-2 animate-pulse",
};

type ToastType = keyof typeof STYLES;

export const notify = (
  type: ToastType = "success",
  msg?: string,
  isLoading: boolean = false
) => {
  const isRTL = t("dir") === "rtl";

  let message = msg || t("Successful operation");
  if (type === "error" && !msg) {
    message = t("Something went wrong");
  }
  if (isLoading && !msg) {
    message = t("Uploading now...");
  }

  const className = `${STYLES[isLoading ? "loading" : type]} ${
    isRTL ? "flex-row-reverse text-right" : "flex-row text-left"
  }`;

  const options: ToastOptions_TP = {
    ...toastOptions,
    autoClose: isLoading ? false : 5000,
    draggable: true,
    pauseOnHover: true,
    hideProgressBar: false,
    closeOnClick: false,
    className,
    position: isRTL
      ? ("top-left" as ToastPosition)
      : ("top-right" as ToastPosition),
    closeButton: true,
    transition: Bounce,
  };

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "info":
      toast.info(message, options);
      break;
    default:
      toast(message, options); // fallback
  }
};
