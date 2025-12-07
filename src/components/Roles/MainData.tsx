import { Form, Formik } from "formik";
import { useState } from "react";
import { useMutate } from "../../hooks/useMutate";
import Button from "../ui/button/Button";
import { notify } from "../../utils/toast";
import { useTranslation } from "react-i18next";
import { MainDataProps, MainDataValidation } from "./Types&Validation";
import useFetch from "../../hooks/useFetch";
import Spinner from "../ui/spinner/Spinner";
import BaseInputField from "../ui/form/formik-field/BaseInputField";
import ComponentCard from "../ui/ComponentCard";
import SwitchField from "../ui/form/formik-field/SwitchField";

// Define interfaces
interface Permission {
     id: number;
     name: string;
     guard_name: string;
}

interface Translations {
     [key: string]: string;
}

interface FormValues {
     name: string;
     permissions: { [key: string]: boolean };
}

const MainData = ({ row, setModalOpen, setData, refetch }: MainDataProps) => {
     const [loading, setLoading] = useState<boolean>(false);
     const { t } = useTranslation();

     const { mutate } = useMutate({
          endpoint: "mcp/roles",
          mutationKey: ["mcp/roles"],
          method: "post",
          onSuccess: () => {
               refetch();
               setModalOpen(false);
               setLoading(false);
               setData && setData({});
               notify("success", t("Package created successfully"));
          },
          onError: (error: any) => {
               notify("error", error?.response?.data?.message || t("Something went wrong"));
               setLoading(false);
          },
          formData: true,
     });

     const { mutate: update } = useMutate({
          endpoint: `mcp/roles/${row.id}`,
          mutationKey: [`mcp/roles/${row.id}`],
          method: "put",
          onSuccess: () => {
               refetch();
               setModalOpen(false);
               setLoading(false);
               setData && setData({});
               notify("success", t("Package updated successfully"));
          },
          onError: (error: any) => {
               setLoading(false);
               notify("error", error?.response?.data?.message || t("Something went wrong"));
          },
     });

     const { data, isLoading } = useFetch<{ data: Permission[] }>({
          queryKey: ["mcp/permissions"],
          endpoint: "mcp/permissions",
     });

     const translations: Translations = {
          show_package: t("Show Package"),
          add_package: t("Add Package"),
          update_package: t("Update Package"),
          delete_package: t("Delete Package"),
          show_ticket: t("Show Ticket"),
          store_ticket: t("Store Ticket"),
          show_contact: t("Show Contact"),
          delete_contact: t("Delete Contact"),
          show_company: t("Show Company"),
          show_project_type: t("Show Project Type"),
          add_project_type: t("Add Project Type"),
          update_project_type: t("Update Project Type"),
          delete_project_type: t("Delete Project Type"),
          show_moderator: t("Show Moderator"),
          add_moderator: t("Add Moderator"),
          update_moderator: t("Update Moderator"),
          delete_moderator: t("Delete Moderator"),
          show_manager: t("Show Manager"),
          add_manager: t("Add Manager"),
          update_manager: t("Update Manager"),
          delete_manager: t("Delete Manager"),
          show_subscription: t("Show Subscription"),
          add_subscription: t("Add Subscription"),
          update_subscription: t("Update Subscription"),
          delete_subscription: t("Delete Subscription"),
     };

     const permissionGroups: { [key: string]: string[] } = {
          package: ["show_package", "add_package", "update_package", "delete_package"],
          ticket: ["show_ticket", "store_ticket"],
          contact: ["show_contact", "delete_contact"],
          company: ["show_company"],
          projectType: ["show_project_type", "add_project_type", "update_project_type", "delete_project_type"],
          moderator: ["show_moderator", "add_moderator", "update_moderator", "delete_moderator"],
          manager: ["show_manager", "add_manager", "update_manager", "delete_manager"],
          subscription: ["show_subscription", "add_subscription", "update_subscription", "delete_subscription"],
     };

     const handleSubmit = (values: FormValues) => {
          setLoading(true);
          // @ts-ignore
          const validPermissionIds = new Set<number>(data?.result?.data?.map(p => p.id) || []);
          const dataToSend = {
               name: values.name,
               guard_name: "moderator" as const,
               permissions: Object.keys(values.permissions || {})
                    .filter((key) => values.permissions[key] && validPermissionIds.has(parseInt(key)))
                    .map((key) => parseInt(key)),
          };
          row.id ? update(dataToSend) : mutate(dataToSend);
     };

     const getValidInitialPermissions = (): { [key: string]: boolean } => {
          // @ts-ignore
          if (!data?.result?.data || !row?.permissions) return {};
          // @ts-ignore
          const validIds = new Set<number>(data.result.data.map(p => p.id));
          return row.permissions.reduce((acc: { [key: string]: boolean }, perm: Permission) => {
               if (validIds.has(perm.id) && perm.guard_name === "moderator") {
                    acc[perm.id] = true;
               }
               return acc;
          }, {});
     };

     return (
          <div className="h-full p-10">
               <Formik<FormValues>
                    initialValues={{
                         name: row?.name || "",
                         permissions: getValidInitialPermissions(),
                    }}
                    validationSchema={MainDataValidation}
                    onSubmit={handleSubmit}
               >
                    {({ handleSubmit, setFieldValue }) => (
                         <Form onSubmit={handleSubmit}>
                              <div className="pb-10">
                                   <div className="grid grid-cols-1 gap-4 mt-5">
                                        <BaseInputField name="name" type="text" label={t("Name")} required />
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                             {Object.entries(permissionGroups).map(([groupName, permissions]) => {
                                                  // @ts-ignore
                                                  const groupPermissions = data?.result?.data?.filter((permission: Permission) =>
                                                       permissions.includes(permission.name) && permission.guard_name === "moderator"
                                                  ) || [];

                                                  return (
                                                       <ComponentCard
                                                            key={groupName}
                                                            title={t(`${groupName.charAt(0).toUpperCase() + groupName.slice(1)} Permissions`)}
                                                            isLoading={isLoading}
                                                       >
                                                            {isLoading ? (
                                                                 <div className="flex justify-center py-4">
                                                                      <Spinner />
                                                                 </div>
                                                            ) : (
                                                                 <div className="space-y-4">
                                                                      <SwitchField
                                                                           name={`selectAll_${groupName}`}
                                                                           label={t("Select All")}
                                                                           disabled={loading || isLoading}
                                                                           onChange={(checked: boolean) => {
                                                                                groupPermissions.forEach((permission: any) => {
                                                                                     setFieldValue(
                                                                                          `permissions.${permission.id}`,
                                                                                          checked
                                                                                     );
                                                                                });
                                                                           }}
                                                                      />
                                                                      {groupPermissions.map((permission: Permission) => (
                                                                           <SwitchField
                                                                                key={permission.id}
                                                                                name={`permissions.${permission.id}`}
                                                                                label={translations[permission.name]}
                                                                                disabled={loading || isLoading}
                                                                                onChange={(checked: boolean) => {
                                                                                     setFieldValue(`permissions.${permission.id}`, checked);
                                                                                }}
                                                                           />
                                                                      ))}
                                                                 </div>
                                                            )}
                                                       </ComponentCard>
                                                  );
                                             })}
                                        </div>
                                   </div>
                                   <Button
                                        className="mt-4"
                                        variant="primary"
                                        loading={loading}
                                        disabled={loading || isLoading}
                                   >
                                        {row.id ? t("Update") : t("Create")}
                                   </Button>
                                   <Button
                                        className="mt-4 mx-2"
                                        variant="outline"
                                        onClick={() => setModalOpen(false)}
                                        disabled={loading || isLoading}
                                   >
                                        {t("Cancel")}
                                   </Button>
                              </div>
                         </Form>
                    )}
               </Formik>
          </div>
     );
};

export default MainData;