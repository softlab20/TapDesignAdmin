import { Form, Formik, FieldArray } from "formik";
import { useState } from "react";
import { useMutate } from "../../hooks/useMutate";
import { notify } from "../../utils/toast";
import { useTranslation } from "react-i18next";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import BaseInputField from "../ui/form/formik-field/BaseInputField";
import { OrderFormValidation, OrderFormValues } from "./Types&Validation";
import useFetch from "../../hooks/useFetch";
import SelectField from "../ui/form/formik-field/SelectField";
import { FiPlus, FiTrash2 } from "react-icons/fi";

interface OrderFormModalProps {
     isOpen: boolean;
     onClose: () => void;
     order?: any;
     refetch: () => void;
}

const OrderFormModal = ({ isOpen, onClose, order, refetch }: OrderFormModalProps) => {
     const [loading, setLoading] = useState<boolean>(false);
     const { t, i18n } = useTranslation();
     const isArabic = i18n.language === 'ar';

     // Fetch users
     const { data: usersData } = useFetch<any>({
          endpoint: "mcp/users?limit=100000",
          queryKey: ["mcp/users"],
     });
     // @ts-ignore
     const users = usersData?.result?.data || [];
     const userOptions = users.map((user: any) => ({
          value: String(user.id),
          label: user.name || user.email
     }));

     // Fetch products
     const { data: productsData } = useFetch<any>({
          endpoint: "mcp/products?limit=100000",
          queryKey: ["mcp/products"],
     });
     // @ts-ignore
     const products = productsData?.result?.data || [];
     const productOptions = products.map((product: any) => ({
          value: String(product.id),
          label: isArabic ? product.title_ar : product.title_en
     }));

     const { mutate: createOrder } = useMutate({
          endpoint: "mcp/orders",
          mutationKey: ["mcp/orders"],
          method: "post",
          onSuccess: () => {
               refetch();
               onClose();
               setLoading(false);
               notify("success", t("created successfully"));
          },
          onError: (error) => {
               notify("error", error?.response?.data?.message || t("Something went wrong"));
               setLoading(false);
          },
          formData: false,
     });

     const { mutate: updateOrder } = useMutate({
          endpoint: `mcp/orders/${order?.id}`,
          mutationKey: [`mcp/orders/${order?.id}`],
          method: "put",
          onSuccess: () => {
               refetch();
               onClose();
               setLoading(false);
               notify("success", t("updated successfully"));
          },
          onError(error) {
               setLoading(false);
               notify("error", error?.response?.data?.message || t("Something went wrong"));
          },
     });

     const handleSubmit = (values: OrderFormValues) => {
          setLoading(true);
          const payload = {
               user_id: Number(values.user_id),
               address_id: Number(values.address_id),
               items: values.items.map(item => ({
                    product_id: Number(item.product_id),
                    quantity: Number(item.quantity)
               })),
               coupon_code: values.coupon_code || undefined
          };

          order?.id ? updateOrder(payload) : createOrder(payload);
     };

     return (
          <Modal isOpen={isOpen} onClose={onClose} showCloseButton={true}>
               <div className="p-6 max-h-[85vh] overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                         {order?.id 
                              ? (isArabic ? 'تعديل الطلب' : 'Edit Order')
                              : (isArabic ? 'إنشاء طلب جديد' : 'Create New Order')
                         }
                    </h2>

                    <Formik
                         initialValues={{
                              user_id: order?.user_id?.toString() || "",
                              address_id: order?.address_id?.toString() || "1",
                              items: order?.items?.map((item: any) => ({
                                   product_id: item.product_id?.toString() || "",
                                   quantity: item.quantity || 1
                              })) || [{ product_id: "", quantity: 1 }],
                              coupon_code: order?.coupon?.code || ""
                         }}
                         validationSchema={OrderFormValidation}
                         onSubmit={handleSubmit}
                    >
                         {({ handleSubmit, values }) => (
                              <Form onSubmit={handleSubmit}>
                                   <div className="space-y-6">
                                        {/* User & Address */}
                                        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
                                             <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                                  {isArabic ? 'معلومات العميل' : 'Customer Information'}
                                             </h3>
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  <SelectField
                                                       name="user_id"
                                                       label={isArabic ? 'العميل' : 'Customer'}
                                                       options={userOptions}
                                                       placeholder={isArabic ? 'اختر العميل' : 'Select customer'}
                                                       required
                                                  />
                                                  <BaseInputField
                                                       name="address_id"
                                                       type="number"
                                                       label={isArabic ? 'رقم العنوان' : 'Address ID'}
                                                       required
                                                  />
                                             </div>
                                        </div>

                                        {/* Order Items */}
                                        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
                                             <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                                  {isArabic ? 'منتجات الطلب' : 'Order Items'}
                                             </h3>
                                             <FieldArray name="items">
                                                  {({ push, remove }) => (
                                                       <div className="space-y-4">
                                                            {values.items.map((_item: any, index: number) => (
                                                                 <div key={index} className="flex gap-3 items-start bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                                                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                           <SelectField
                                                                                name={`items.${index}.product_id`}
                                                                                label={isArabic ? 'المنتج' : 'Product'}
                                                                                options={productOptions}
                                                                                placeholder={isArabic ? 'اختر المنتج' : 'Select product'}
                                                                                required
                                                                           />
                                                                           <BaseInputField
                                                                                name={`items.${index}.quantity`}
                                                                                type="number"
                                                                                label={isArabic ? 'الكمية' : 'Quantity'}
                                                                                min="1"
                                                                                required
                                                                           />
                                                                      </div>
                                                                      {values.items.length > 1 && (
                                                                           <button
                                                                                type="button"
                                                                                onClick={() => remove(index)}
                                                                                className="mt-8 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                           >
                                                                                <FiTrash2 className="w-5 h-5" />
                                                                           </button>
                                                                      )}
                                                                 </div>
                                                            ))}
                                                            <button
                                                                 type="button"
                                                                 onClick={() => push({ product_id: "", quantity: 1 })}
                                                                 className="w-full py-3 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2 font-medium"
                                                            >
                                                                 <FiPlus className="w-5 h-5" />
                                                                 {isArabic ? 'إضافة منتج' : 'Add Product'}
                                                            </button>
                                                       </div>
                                                  )}
                                             </FieldArray>
                                        </div>

                                        {/* Coupon Code */}
                                        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
                                             <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                                  {isArabic ? 'كود الخصم (اختياري)' : 'Coupon Code (Optional)'}
                                             </h3>
                                             <BaseInputField
                                                  name="coupon_code"
                                                  type="text"
                                                  label={isArabic ? 'كود الكوبون' : 'Coupon Code'}
                                                  placeholder={isArabic ? 'أدخل كود الكوبون' : 'Enter coupon code'}
                                             />
                                        </div>
                                   </div>

                                   {/* Actions */}
                                   <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <Button
                                             variant="outline"
                                             onClick={onClose}
                                             disabled={loading}
                                        >
                                             {isArabic ? 'إلغاء' : 'Cancel'}
                                        </Button>
                                        <Button
                                             loading={loading}
                                             disabled={loading}
                                        >
                                             {order?.id 
                                                  ? (isArabic ? 'تحديث' : 'Update')
                                                  : (isArabic ? 'إنشاء' : 'Create')
                                             }
                                        </Button>
                                   </div>
                              </Form>
                         )}
                    </Formik>
               </div>
          </Modal>
     );
};

export default OrderFormModal;
