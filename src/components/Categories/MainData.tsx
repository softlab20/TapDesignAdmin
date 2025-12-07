import { Form, Formik } from "formik"
import { useState } from "react"
import { useMutate } from "../../hooks/useMutate"
import Button from "../ui/button/Button"
import { notify } from "../../utils/toast"
import { useTranslation } from "react-i18next"
import { MainDataProps, MainDataValidation } from "./Types&Validation"
import BaseInputField from "../ui/form/formik-field/BaseInputField"
import ImageUploadField from "../ui/form/formik-field/ImageUploadField"

const MainData = ({ row, setModalOpen, setData, refetch }: MainDataProps) => {
     const [loading, setLoading] = useState<boolean>(false);
     const { t } = useTranslation()
     const { mutate } = useMutate({
          endpoint: "mcp/categories",
          mutationKey: ["mcp/categories"],
          method: "post",
          onSuccess: () => {
               refetch();
               setModalOpen(false);
               setLoading(false);
               setData && setData({});
               notify("success", t("created successfully"))
          },
          onError: (error) => {
               notify("error", error?.response?.data?.message || t("Something went wrong"))
               setLoading(false);
          },
          formData: false,
     })

     const { mutate: update } = useMutate({
          endpoint: `mcp/categories/${row.id}`,
          mutationKey: [`mcp/categories/${row.id}`],
          method: "put",
          onSuccess: () => {
               refetch();
               setModalOpen(false);
               setLoading(false);
               setData && setData({});
               notify("success", t("updated successfully"))
          },
          onError(error) {
               setLoading(false);
               notify("error", error?.response?.data?.message || t("Something went wrong"))
          },
     })

     const handleSubmit = (values: any) => {
          setLoading(true);
          const dataToSend: any = {
               title_ar: values.title_ar,
               title_en: values.title_en,
          };
          
          // إرسال image فقط إذا تم تغييرها أو كانت جديدة
          if (values.image !== row?.image) {
               dataToSend.image = values.image || "";
          }
          
          row.id ? update(dataToSend) : mutate(dataToSend);
     }

     return (
          <div className="h-full p-10">
               <h2 className="text-xl font-bold mb-6">
                    {row.id ? t("Edit Category") : t("Add New Category")}
               </h2>
               <Formik
                    initialValues={{
                         title_ar: row?.title_ar || "",
                         title_en: row?.title_en || "",
                         image: row?.image || "",
                    }}
                    validationSchema={MainDataValidation}
                    onSubmit={(values) => handleSubmit(values)}
               >
                    {({ handleSubmit }) => (
                         <Form onSubmit={handleSubmit}>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                                   <BaseInputField name="title_ar" type="text" label={t("Arabic Title")} required />
                                   <BaseInputField name="title_en" type="text" label={t("English Title")} required />
                              </div>
                              <div className="mt-5">
                                   <ImageUploadField 
                                        name="image" 
                                        label={t("Category Image")} 
                                        currentImage={row?.web_image}
                                   />
                              </div>
                              <div className="flex gap-2 mt-6">
                                   <Button
                                        className="mt-4"
                                        variant="primary"
                                        loading={loading}
                                        disabled={loading}
                                   >
                                        {row.id ? t("Update") : t("Create")}
                                   </Button>
                                   <Button
                                        className="mt-4"
                                        variant="outline"
                                        onClick={() => setModalOpen(false)}
                                        disabled={loading}
                                   >
                                        {t("Cancel")}
                                   </Button>
                              </div>
                         </Form>
                    )}
               </Formik>
          </div>
     )
}

export default MainData