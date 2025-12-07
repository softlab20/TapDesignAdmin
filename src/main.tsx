import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";
import "flatpickr/dist/flatpickr.css";
import "./utils/i18n.ts"
import App from "./App.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/auth-and-perm/AuthProvider.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppWrapper } from "./components/ui/PageMeta.tsx";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <AuthProvider>
        <ThemeProvider>
          <AppWrapper>
            <ToastContainer
              position="top-right"
              toastClassName="z-[100000]"
              className="z-[100000]"
              style={{ zIndex: 100000 }}
            />
            <App />
          </AppWrapper>
        </ThemeProvider>
      </AuthProvider>
    </StrictMode>
  </QueryClientProvider>
);
