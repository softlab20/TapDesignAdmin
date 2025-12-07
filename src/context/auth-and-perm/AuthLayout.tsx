import { useOutlet } from "react-router";
import { AuthProvider } from "./AuthProvider";

export const AuthLayout = () => {
  const outlet = useOutlet();

  return (
    <AuthProvider>{outlet}</AuthProvider>
  );
};