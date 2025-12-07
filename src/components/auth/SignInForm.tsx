import Button from "../ui/button/Button";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutate } from "../../hooks/useMutate";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/auth-and-perm/AuthProvider";
import Input from "../ui/form/input/InputField";

export default function SignInForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useAuth()
  const { mutate, isPending, isError, error } = useMutate({
    endpoint: "mcp/login",
    mutationKey: ["mcp/login"],
    onSuccess: (res: any) => {
      navigate("/");
      Cookies.set("token", res?.data?.result?.data?.token, { expires: 7, secure: true });
      login(res?.data?.result?.data);
    },
  });

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {t("Sign In")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("Enter your email and password to sign in!")}
            </p>
          </div>
          <div>
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={Yup.object({
                email: Yup.string()
                  .email("Invalid email address")
                  .required("Email is required"),
                password: Yup.string().required("Password is required"),
              })}
              onSubmit={(values) => {
                mutate(values);
              }}
            >
              {({ errors, touched }) => (
                <Form className="space-y-6">
                  <div className="space-y-6">
                    <div>
                      <Field name="email">
                        {({ field }: { field: any }) => (
                          <Input
                            {...field}
                            type="email"
                            placeholder="info@gmail.com"
                            id="email"
                            disabled={isPending}
                            error={touched.email && !!errors.email}
                            success={touched.email && !errors.email}
                            hint={touched.email && errors.email ? errors.email : ""}
                            label={t("Email")}
                            required
                          />
                        )}
                      </Field>
                    </div>
                    <div>
                      <Field name="password">
                        {({ field }: { field: any }) => (
                          <Input
                            {...field}
                            type="password"
                            placeholder={t("Enter your password")}
                            id="password"
                            disabled={isPending}
                            error={touched.password && !!errors.password}
                            success={touched.password && !errors.password}
                            hint={
                              touched.password && errors.password
                                ? errors.password
                                : ""
                            }
                            label={t("Password")}
                            required
                          />
                        )}
                      </Field>
                    </div>
                    {isError && (
                      <div className="text-sm text-error-500">
                        {
                          // @ts-ignore
                          error instanceof Error ? error?.response?.data?.message : "Failed to sign in"
                        }
                      </div>
                    )}
                    <div>
                      <Button
                        className="w-full"
                        size="sm"
                        loading={isPending}
                      >
                        {t("Sign In")}
                      </Button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}