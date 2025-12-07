import { Form, Formik, FieldArray } from "formik";
import { useState } from "react";
import { useMutate } from "../../hooks/useMutate";
import Button from "../ui/button/Button";
import { notify } from "../../utils/toast";
import { useTranslation } from "react-i18next";
import { MainDataProps, MainDataValidation, ProductFormValues } from "./Types&Validation";
import BaseInputField from "../ui/form/formik-field/BaseInputField";
import SelectField from "../ui/form/formik-field/SelectField";
import TextAreaField from "../ui/form/formik-field/TextAreaField";
import useFetch from "../../hooks/useFetch";
import ImageUploadField from "../ui/form/formik-field/ImageUploadField";
import ImagesUploadField from "../ui/form/formik-field/ImagesUploadField";
import RadioField from "../ui/form/formik-field/RadioField";

const MainData = ({ row, setModalOpen, setData, refetch }: MainDataProps) => {
     const [loading, setLoading] = useState<boolean>(false);
     const { t } = useTranslation();

     // Fetch categories
     const { data: categoriesData } = useFetch<any>({
          endpoint: "mcp/categories?limit=100000",
          queryKey: ["mcp/categories?limit=100000"],
     });
     // @ts-ignore
     const categories = categoriesData?.result?.data || [];
     const categoryOptions = categories.map((cat: any) => {
          const lang = localStorage.getItem("i18nextLng") || "ar";
          const label = lang === "ar" ? cat.title_ar || cat.name : cat.title_en || cat.name;
          return { value: String(cat.id), label };
     });

     const { mutate } = useMutate({
          endpoint: "mcp/products",
          mutationKey: ["mcp/products"],
          method: "post",
          onSuccess: () => {
               refetch();
               setModalOpen(false);
               setLoading(false);
               setData && setData({});
               notify("success", t("created successfully"));
          },
          onError: (error) => {
               notify("error", error?.response?.data?.message || t("Something went wrong"));
               setLoading(false);
          },
          formData: false,
     });

     const { mutate: update } = useMutate({
          endpoint: `mcp/products/${row.id}`,
          mutationKey: [`mcp/products/${row.id}`],
          method: "put",
          onSuccess: () => {
               refetch();
               setModalOpen(false);
               setLoading(false);
               setData && setData({});
               notify("success", t("updated successfully"));
          },
          onError(error) {
               setLoading(false);
               notify("error", error?.response?.data?.message || t("Something went wrong"));
          },
     });

     const arrayEqual = (a?: string[], b?: string[]) => {
          if (!a && !b) return true;
          if (!a || !b) return false;
          if (a.length !== b.length) return false;
          for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
          return true;
     };

     const handleSubmit = (values: ProductFormValues) => {
          setLoading(true);
          const payload: any = {
               title_ar: values.title_ar,
               title_en: values.title_en,
               features_ar: (values.features_ar || []).filter(Boolean),
               features_en: (values.features_en || []).filter(Boolean),
               description: values.description,
               additional_info: values.additional_info,
               shipping_info: values.shipping_info,
               in_stock: !!values.in_stock,
               category_id: values.category_id ? Number(values.category_id) : undefined,
               price: Number(values.price),
               sale_amount:
                    values.sale_amount !== undefined && values.sale_amount !== null && values.sale_amount !== ""
                         ? Number(values.sale_amount)
                         : undefined,
               personilze: !!values.personilze,
               personilze_price: values.personilze ? Number(values.personilze_price || 0) : undefined,
               personilze_details: values.personilze
                    ? {
                         options: (values.personilze_details?.options || []).filter(Boolean),
                         max_characters: values.personilze_details?.max_characters
                              ? Number(values.personilze_details.max_characters)
                              : undefined,
                    }
                    : undefined,
               colors: (values.colors || []).filter(Boolean),
          };

          if (!row.id || values.main_image !== row?.main_image) {
               payload.main_image = values.main_image || "";
          }
          if (!row.id || !arrayEqual(values.images, row?.web_images)) {
               payload.images = values.images || [];
          }

          row.id ? update(payload) : mutate(payload);
     };

     return (
          <div className="h-full p-10 max-h-[90vh] overflow-y-auto">
               <h2 className="text-xl font-bold mb-6">{row.id ? t("Edit Product") : t("Add New Product")}</h2>
               <Formik
                    initialValues={{
                         title_ar: row?.title_ar || "",
                         title_en: row?.title_en || "",
                         features_ar: Array.isArray(row?.features_ar) ? row.features_ar : [""],
                         features_en: Array.isArray(row?.features_en) ? row.features_en : [""],
                         description: row?.description || "",
                         additional_info: row?.additional_info || "",
                         shipping_info: row?.shipping_info || "",
                         in_stock: !!row?.in_stock,
                         category_id: row?.category_id?.toString() || "",
                         price: row?.price || "",
                         sale_amount: row?.sale_amount || "",
                         personilze: !!row?.personilze,
                         personilze_price: row?.personilze_price || "",
                         personilze_details: {
                              options: row?.personilze_details?.options || [""],
                              max_characters: row?.personilze_details?.max_characters || "",
                         },
                         colors: row?.colors?.length ? row.colors : [""],
                         main_image: row?.main_image || "",
                         images: row?.web_images || [],
                    }}
                    validationSchema={MainDataValidation}
                    onSubmit={handleSubmit}
               >
                    {({ handleSubmit, values, setFieldValue }) => (
                         <Form onSubmit={handleSubmit}>
                              <div className="mt-5 space-y-6">
                                   <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 md:p-6 shadow-sm">
                                        <div className="grid grid-cols-2 gap-4">
                                             <BaseInputField className="w-full" name="title_ar" type="text" label={t("Arabic Title")} required />
                                             <BaseInputField className="w-full" name="title_en" type="text" label={t("English Title")} required />
                                             <div className="md:col-span-2">
                                                  <SelectField className="w-full" name="category_id" label={t("Category")} options={categoryOptions} required placeholder={t("Select")} />
                                             </div>
                                             <div className="md:col-span-2 flex flex-wrap items-center gap-6 pt-1">
                                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("Stock Status")}:</span>
                                                  <div className="flex gap-6">
                                                       <RadioField name="in_stock" id="inStockTrue" label={t("In Stock")} value={true as any} />
                                                       <RadioField name="in_stock" id="inStockFalse" label={t("Out of Stock")} value={false as any} />
                                                  </div>
                                             </div>
                                        </div>
                                   </div>

                                   <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 md:p-6 shadow-sm">
                                        <div className="grid grid-cols-1 gap-4">
                                             <BaseInputField className="w-full" name="price" type="number" label={t("Price")} required step={0.01} />
                                             <BaseInputField className="w-full" name="sale_amount" type="number" label={t("Price after discount")} step={0.01} />
                                        </div>
                                   </div>

                                   <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 md:p-6 shadow-sm">
                                        <div className="grid grid-cols-1 gap-4">
                                             <div className="md:col-span-1">
                                                  <TextAreaField className="w-full" name="description" label={t("Description")} rows={5} placeholder={t("Enter Description")} />
                                             </div>
                                             <div className="md:col-span-1">
                                                  <TextAreaField className="w-full" name="additional_info" label={t("Additional Info")} rows={5} placeholder={t("Enter Additional Info")} />
                                             </div>
                                             <div className="md:col-span-1">
                                                  <TextAreaField className="w-full" name="shipping_info" label={t("Shipping Info")} rows={5} placeholder={t("Enter Shipping Info")} />
                                             </div>
                                        </div>
                                   </div>

                                   <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 md:p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                             <label className="text-sm font-medium">{t("Arabic Features")}</label>
                                             <FieldArray name="features_ar">
                                                  {({ remove, push }) => (
                                                       <div className="space-y-2 mt-2">
                                                            {(values.features_ar || []).map((_: string, idx: number) => (
                                                                 <div key={idx} className="flex gap-2 items-end">
                                                                      <div className="w-full">
                                                                           <BaseInputField className="w-full" name={`features_ar.${idx}`} type="text" label="" />
                                                                      </div>
                                                                      <Button size="xs" className="h-11 w-11 p-0" variant="outline" onClick={() => remove(idx)}>
                                                                           -
                                                                      </Button>
                                                                 </div>
                                                            ))}
                                                            <Button size="xs" variant="outline" onClick={() => push("")}>+ {t("Add")}</Button>
                                                       </div>
                                                  )}
                                             </FieldArray>
                                        </div>
                                        <div>
                                             <label className="text-sm font-medium w-full">{t("English Features")}</label>
                                             <FieldArray name="features_en">
                                                  {({ remove, push }) => (
                                                       <div className="space-y-2 mt-2 w-full">
                                                            {(values.features_en || []).map((_: string, idx: number) => (
                                                                 <div key={idx} className="flex gap-2 w-full items-end">
                                                                      <div className="w-full">
                                                                           <BaseInputField className="w-full" name={`features_en.${idx}`} type="text" label="" />
                                                                      </div>
                                                                      <Button size="xs" className="h-11 w-11 p-0" variant="outline" onClick={() => remove(idx)} >
                                                                           -
                                                                      </Button>
                                                                 </div>
                                                            ))}
                                                            <Button size="xs" variant="outline" onClick={() => push("")}>+ {t("Add")}</Button>
                                                       </div>
                                                  )}
                                             </FieldArray>
                                        </div>
                                   </div>

                                   <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 md:p-6 shadow-sm">
                                        <label className="text-sm font-medium">{t("Colors (hex)")}</label>
                                        <FieldArray name="colors">
                                             {({ remove, push }) => (
                                                  <div className="space-y-2 mt-2">
                                                       {(values.colors || []).map((_: string, idx: number) => (
                                                            <div key={idx} className="flex gap-2 items-center">
                                                                 <div className="w-full">
                                                                      <BaseInputField className="w-full" name={`colors.${idx}`} type="text" label="" placeholder="#000000" />
                                                                 </div>
                                                                 <input
                                                                      type="color"
                                                                      aria-label={t("Pick Color") as string}
                                                                      title={(values.colors?.[idx] as string) || "#000000"}
                                                                      className="h-11 w-11 cursor-pointer rounded-lg border p-1 border-gray-300 dark:border-gray-700 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                                                                      value={(values.colors?.[idx] as string) || "#000000"}
                                                                      onChange={(e) => setFieldValue(`colors.${idx}`, e.target.value)}
                                                                 />
                                                                 <Button size="xs" className="h-11 w-11 p-0" variant="outline" onClick={() => remove(idx)}>
                                                                      -
                                                                 </Button>
                                                            </div>
                                                       ))}
                                                       <Button size="xs" variant="outline" onClick={() => push("")}>+ {t("Add Color")}</Button>
                                                  </div>
                                             )}
                                        </FieldArray>
                                   </div>

                                   <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 md:p-6 shadow-sm">
                                        <div className="flex items-center gap-4">
                                             <RadioField name="personilze" id="persYes" label={t("Personalize") + " : " + t("Yes")} value={true as any} />
                                             <RadioField name="personilze" id="persNo" label={t("Personalize") + " : " + t("No")} value={false as any} />
                                        </div>
                                        {values.personilze && (
                                             <div className="grid grid-cols-1 gap-4 mt-3">
                                                  <BaseInputField className="w-full" name="personilze_price" type="number" label={t("Personalize Price")} step={0.01} />
                                                  <FieldArray name="personilze_details.options">
                                                       {({ remove, push }) => (
                                                            <div className="md:col-span-2">
                                                                 <label className="text-sm font-medium">{t("Personalize Options")}</label>
                                                                 <div className="space-y-2 mt-2">
                                                                      {(values.personilze_details?.options || []).map((_: string, idx: number) => (
                                                                           <div key={idx} className="flex gap-2 items-end">
                                                                                <BaseInputField className="w-full" name={`personilze_details.options.${idx}`} type="text" label="" />
                                                                                <Button size="xs" className="h-9 w-9 p-0" variant="outline" onClick={() => remove(idx)}>
                                                                                     -
                                                                                </Button>
                                                                           </div>
                                                                      ))}
                                                                      <Button size="xs" variant="outline" onClick={() => push("")}>+ {t("Add Option")}</Button>
                                                                 </div>
                                                            </div>
                                                       )}
                                                  </FieldArray>
                                                  <BaseInputField className="w-full" name="personilze_details.max_characters" type="number" label={t("Max Characters")} />
                                             </div>
                                        )}
                                   </div>

                                   <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 md:p-6 shadow-sm grid grid-cols-1 gap-6">
                                        <ImageUploadField name="main_image" label={t("Main Image")} required={!row.id} currentImage={row?.web_image} />
                                        <ImagesUploadField name="images" label={t("Gallery Images")} currentImages={row?.images || []} />
                                   </div>

                                   <div className="flex gap-3 mt-6">
                                        <Button className="mt-2" variant="primary" loading={loading} disabled={loading}>
                                             {row.id ? t("Update") : t("Create")}
                                        </Button>
                                        <Button className="mt-2" variant="outline" onClick={() => setModalOpen(false)} disabled={loading}>
                                             {t("Cancel")}
                                        </Button>
                                   </div>
                              </div>
                         </Form>
                    )}
               </Formik>
          </div>
     );
};

export default MainData;
