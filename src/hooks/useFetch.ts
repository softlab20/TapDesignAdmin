import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { notify } from "../utils/toast";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

type UseFetchProps_TP = {
  queryKey: [string];
  endpoint: string;
  enabled?: boolean;
  select?: ((data: any) => any) | undefined;
  onError?: (err: any) => void;
  onSuccess?: (data: any) => void;
  localization?: boolean;
};

function useFetch<T>({
  endpoint,
  enabled,
  select,
  queryKey,
  onError,
  onSuccess,
}: UseFetchProps_TP) {
  const user_token = Cookies.get("token");
  const token = user_token;
  const authorizationHeader = `Bearer ${token}`;
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const config = {
    headers: {
      Authorization: authorizationHeader,
      "Accept-Language": lang || "en",
      "Content-Type": "application/json",
    },
  };
  const baseURL = import.meta.env.VITE_BASE_URL;

  // Function to handle logout on token expiration
  const handleLogout = () => {
    localStorage.removeItem("user");
    Cookies.remove("token");
    navigate("/signin");
    notify("error", "Session expired.");
  };

  const query = useQuery<T, Error>({
    queryKey,
    queryFn: async () => {
      try {
        const response = await axios.get(`${baseURL}/${endpoint}`, config);
        return response.data;
      } catch (error: any) {
        if (
          error?.response?.status === 401 ||
          error?.response?.data?.message === "Unauthenticated." || 
          error?.response?.data?.message === "Invalid ability provided." ||
          error?.response?.data?.message === "Token has expired."
        ) {
          handleLogout();
        }
        throw error; // Re-throw to trigger onError
      }
    },
    enabled: enabled ?? !!token, // Only enable if token exists
    select,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false; // No retry on 401
      return failureCount < 2; // Retry up to 2 times for other errors
    },
    // Handle success and error via callbacks
    // @ts-ignore
    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "An error occurred";
      notify("error", errorMessage);

      if (onError) {
        onError(error);
      }
    },
  });

  return query;
}

export default useFetch;