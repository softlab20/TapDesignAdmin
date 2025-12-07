import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { useAuth } from "../../context/auth-and-perm/AuthProvider";
import { useTranslation } from "react-i18next";
import { Form, Formik } from "formik";
import { MdEdit } from "react-icons/md";
import { useMutate } from "../../hooks/useMutate";
import * as Yup from "yup";
import { IoSettings } from "react-icons/io5";
import BaseInputField from "../ui/form/formik-field/BaseInputField";

export default function UserInfoCard({ openChangePasswordModal }: {
  openChangePasswordModal: () => void;
}
) {
  const { isOpen, openModal, closeModal } = useModal();
  const { user } = useAuth();
  const { t } = useTranslation();

  const { mutate, isPending } = useMutate({
    endpoint: "mcp/profile/update",
    mutationKey: ["mcp/profile/update"],
    onSuccess: () => {
      closeModal();
    }
  });

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            {t("Personal Information")}
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {t("Name")}
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.first_name} {user?.last_name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {t("Email")}
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 lg:justify-end">
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <MdEdit className="text-lg" />
            {t("Edit")}
          </button>

          <button
            onClick={openChangePasswordModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <IoSettings className="text-lg" />
            {t("Change Password")}
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {t("Edit Personal Information")}
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              {t("Update your details to keep your profile up-to-date")}
            </p>
          </div>
          <Formik
            initialValues={{
              first_name: user?.first_name || "",
              last_name: user?.last_name || "",
              email: user?.email || "",
            }}
            validationSchema={Yup.object().shape({
              first_name: Yup.string().required(t("First name is required")),
              last_name: Yup.string().required(t("Last name is required")),
              email: Yup.string()
                .email(t("Invalid email"))
                .required(t("Email is required")),
            })}
            onSubmit={(values) => {
              mutate(values);
            }}
          >
            <Form className="flex flex-col">
              <div className="custom-scrollbar h-[200px] overflow-y-auto px-2 pb-3">
                <div className="mt-7">
                  <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                    {t("Personal Information")}
                  </h5>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div>
                      <BaseInputField
                        label={t("First Name")}
                        name="first_name"
                        type="text"
                        placeholder={t("Enter your first name")}
                        className="w-full"
                        required
                      />
                    </div>

                    <div>
                      <BaseInputField
                        label={t("Last Name")}
                        name="last_name"
                        type="text"
                        placeholder={t("Enter your last name")}
                        className="w-full"
                        required
                      />
                    </div>

                    <div>
                      <BaseInputField
                        label={t("Email")}
                        name="email"
                        type="email"
                        placeholder={t("Enter your email")}
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
    </div>
  );
}
