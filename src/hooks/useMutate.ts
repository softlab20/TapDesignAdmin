import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { notify } from "../utils/toast";

type useMutateProps_TP<response_T> = {
  endpoint: string;
  mutationKey: [string];
  onSuccess?: (data: response_T) => void;
  onError?: (err: any) => void;
  formData?: boolean;
  onMutate?: (err?: unknown) => void;
  method?: "post" | "put" | "patch" | "delete";
};

export function useMutate<response_T>({
  endpoint,
  mutationKey,
  onError,
  onSuccess,
  formData,
  onMutate,
  method = "post", // Set a default value for the method
}: useMutateProps_TP<response_T>) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const user_token = Cookies.get("token");
  const token = user_token;
  const authorizationHeader = `Bearer ${token}`;
  const baseURL = import.meta.env.VITE_BASE_URL;

  const { data, isPending, isSuccess, mutate, failureReason, isError, error } =
    useMutation({
      mutationKey,
      mutationFn: (values) => {
        const requestConfig = {
          method: method.toUpperCase(), // Use the specified method
          url: `${baseURL}/${endpoint}`,
          data: values,
          headers: formData
            ? {
                "Content-Type": "multipart/form-data",
                Authorization: authorizationHeader,
                "Accept-Language": isRTL ? "ar" : "en",
              }
            : {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: authorizationHeader,
                "Accept-Language": isRTL ? "ar" : "en",
              },
          onUploadProgress: (progressEvent: {
            loaded: number;
            total: number;
          }) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        };
        // @ts-ignore
        return axios(requestConfig);
      },
      onSuccess,
      onError: (err: any) => {
        const errorData = err.response?.data as {
          data?: any;
          message?: string;
        };
        if (errorData?.data) {
          Object.values(errorData.data).forEach((messages: any) => {
            if (Array.isArray(messages)) {
              messages.forEach((msg: string) => notify("error", msg));
            } else if (typeof messages === "string") {
              notify("error", messages);
            }
          });
        } else {
          notify("error", errorData?.message || "Something went wrong");
        }
        onError?.(err);
      },

      onMutate,
    });
  return {
    data,
    isPending,
    isSuccess,
    mutate,
    failureReason,
    isError,
    uploadProgress,
    error,
  };
}
