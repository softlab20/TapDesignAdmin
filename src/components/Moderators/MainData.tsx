import { Form, Formik } from "formik";
import { useState } from "react";
import { useMutate } from "../../hooks/useMutate";
import Button from "../ui/button/Button";
import { notify } from "../../utils/toast";
import { useTranslation } from "react-i18next";
import { MainDataProps, MainDataValidation } from "./Types&Validation";
import useFetch from "../../hooks/useFetch";
import BaseInputField from "../ui/form/formik-field/BaseInputField";
import SelectField from "../ui/form/formik-field/SelectField";
import RadioField from "../ui/form/formik-field/RadioField";

interface Option {
     value: any;
     label: string;
}

const MainData = ({ row, setModalOpen, setData, refetch }: MainDataProps) => {
     const [loading, setLoading] = useState<boolean>(false);
     const { t } = useTranslation();
     const { mutate } = useMutate({
          endpoint: "mcp/moderators",
          mutationKey: ["mcp/moderators"],
          method: "post",
          onSuccess: () => {
               refetch();
               setModalOpen(false);
               setLoading(false);
               setData && setData({});
               notify("success", t("Moderator created successfully"));
          },
          onError: (error) => {
               notify("error", error?.response?.data?.message || t("Something went wrong"));
               setLoading(false);
          },
          formData: false,
     });

     const { mutate: update } = useMutate({
          endpoint: `mcp/moderators/${row.id}`,
          mutationKey: [`mcp/moderators/${row.id}`],
          method: "put",
          onSuccess: () => {
               refetch();
               setModalOpen(false);
               setLoading(false);
               setData && setData({});
               notify("success", t("Moderator updated successfully"));
          },
          onError(error) {
               setLoading(false);
               notify("error", error?.response?.data?.message || t("Something went wrong"));
          },
     });

     const handleSubmit = (values: any) => {
          setLoading(true);
          const dataToSend: any = {
               first_name: values.first_name,
               last_name: values.last_name,
               email: values.email,
               is_active: values.is_active === true || values.is_active === "true",
               role_id: Number(values.role_id),
          };
          // Include password fields on create or if provided on update
          if (!row.id || values.password) {
               dataToSend.password = values.password;
               dataToSend.password_confirmation = values.password_confirmation;
          }
          row.id ? update(dataToSend) : mutate(dataToSend);
     };

     const endpoint = `mcp/roles?limit=100000`;
     const { data, isLoading } = useFetch<any>({
          endpoint: endpoint,
          queryKey: [endpoint],
     })

     // @ts-ignore
     const dataOptions: Option[] = data?.result?.data?.map((item: any) => ({
          value: item.id,
          label: item.name,
     })) || [];

     return (
          <div className="h-full p-10">
               <Formik
                    initialValues={{
                         first_name: row?.first_name || "",
                         last_name: row?.last_name || "",
                         email: row?.email || "",
                         password: "",
                         password_confirmation: "",
                         is_active: !!row?.is_active,
                         role_id: row?.role_id || "",
                    }}
                    validationSchema={MainDataValidation}
                    onSubmit={(values) => handleSubmit(values)}
               >
                    {({ handleSubmit }) => (
                         <Form onSubmit={handleSubmit}>
                              <div className="grid grid-cols-2 gap-4 mt-5">
                                   <BaseInputField name="first_name" type="text" label={t("First Name")} required />
                                   <BaseInputField name="last_name" type="text" label={t("Last Name")} required />
                                   <BaseInputField name="email" type="email" label={t("Email")} required />
                                   <BaseInputField name="password" type="password" label={t("Password")} required={!!row.id === false} />
                                   <BaseInputField name="password_confirmation" type="password" label={t("Confirm Password")} required={!!row.id === false} />
                                   <SelectField
                                        name="role_id"
                                        label={t("Role")}
                                        options={dataOptions || []}
                                        required
                                        placeholder={isLoading ? t("Loading...") : t("Select")}
                                   />
                                   <div className="flex gap-10 py-5">
                                        <RadioField
                                             name="is_active"
                                             id="active"
                                             label={t("Active")}
                                             value={true as any}
                                             disabled={loading}
                                        />
                                        <RadioField
                                             name="is_active"
                                             id="inactive"
                                             label={t("Not Active")}
                                             value={false as any}
                                             disabled={loading}
                                        />
                                   </div>
                              </div>
                              <Button
                                   className="mt-4"
                                   variant="primary"
                                   loading={loading}
                                   disabled={loading}
                              >
                                   {row.id ? t("Update") : t("Create")}
                              </Button>
                              <Button
                                   className="mt-4 mx-2"
                                   variant="outline"
                                   onClick={() => setModalOpen(false)}
                                   disabled={loading}
                              >
                                   {t("Cancel")}
                              </Button>
                         </Form>
                    )}
               </Formik>
          </div>
     );
};

export default MainData;