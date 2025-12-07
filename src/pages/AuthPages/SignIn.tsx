import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import PageMeta from "../../components/ui/PageMeta";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="TAPDESIGN - Dashboard"
        description="TAPDESIGN - Dashboard for TAPDESIGN application"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
