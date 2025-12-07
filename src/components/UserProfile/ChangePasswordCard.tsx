import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { useTranslation } from "react-i18next";
import { Form, Formik } from "formik";
import { useMutate } from "../../hooks/useMutate";
import * as Yup from "yup";
import BaseInputField from "../ui/form/formik-field/BaseInputField";

export default function ChangePasswordCard({ closeModal, isOpen }: {
  closeModal: () => void;
  isOpen: boolean;
}) {
  const { t } = useTranslation();

  const { mutate, isPending } = useMutate({
    endpoint: "mcp/profile/password/update",
    mutationKey: ["mcp/profile/password/update"],
    onSuccess: () => {
      closeModal();
    }
  });

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {t("Edit Password Information")}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            {t("Update your password to keep your account secure")}
          </p>
        </div>
        <Formik
          initialValues={{
            old_password: "",
            new_password: "",
            new_password_confirmation: ""
          }}
          validationSchema={Yup.object().shape({
            old_password: Yup.string()
              .required(t("Old Password is required"))
              .min(8, t("Old Password must be at least 8 characters")),
            new_password: Yup.string()
              .required(t("New Password is required"))
              .min(8, t("New Password must be at least 8 characters")),
            new_password_confirmation: Yup.string()
              .oneOf([Yup.ref("new_password"), undefined], t("Passwords must match"))
              .required(t("Confirm Password is required"))
          })}
          onSubmit={(values) => {
            mutate(values);
          }}
        >
          <Form className="flex flex-col">
            <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                  <div>
                    <BaseInputField
                      label={t("Old Password")}
                      name="old_password"
                      type="password"
                      placeholder={t("Enter your Password")}
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <BaseInputField
                      label={t("New Password")}
                      name="new_password"
                      type="password"
                      placeholder={t("Enter your new password")}
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <BaseInputField
                      label={t("Confirm Password")}
                      name="new_password_confirmation"
                      type="password"
                      placeholder={t("Confirm your password")}
                      className="w-full"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                {t("Cancel")}
              </Button>
              <Button size="sm" variant="primary" loading={isPending}>
                {t("Save")}
              </Button>
            </div>
          </Form>
        </Formik>
      </div>
    </Modal>
  );
}
