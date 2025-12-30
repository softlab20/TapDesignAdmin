import { useState } from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../../hooks/useFetch";
import { OrdersReportResponse } from "./Types&Validation";
import Spinner from "../ui/spinner/Spinner";
import { DatePickerField } from "../ui/form/formik-field/DatePickerField";
import { Formik, Form } from "formik";

const OrdersReport = () => {
     const { t } = useTranslation();
     const [startDate, setStartDate] = useState<string>("");
     const [endDate, setEndDate] = useState<string>("");

     const queryParams = new URLSearchParams();
     if (startDate) queryParams.append("start_date", startDate);
     if (endDate) queryParams.append("end_date", endDate);

     const endpoint = `mcp/reports/orders${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

     const { data, isLoading } = useFetch<OrdersReportResponse>({
          endpoint,
          queryKey: [endpoint],
     });

     const ordersData = (data as OrdersReportResponse)?.result?.data;

     return (
          <div className="space-y-6">
               {/* Filters */}
               <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">{t("Filters")}</h3>
                    <Formik
                         initialValues={{ start_date: startDate, end_date: endDate }}
                         onSubmit={() => { }}
                         enableReinitialize
                    >
                         {({ setFieldValue }) => (
                              <Form>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                  {t("Start Date")}
                                             </label>
                                             <DatePickerField
                                                  name="start_date"
                                                  onChange={(date: Date | null) => {
                                                       const formattedDate = date ? date.toISOString().split('T')[0] : "";
                                                       setFieldValue("start_date", formattedDate);
                                                       setStartDate(formattedDate);
                                                  }}
                                             />
                                        </div>
                                        <div>
                                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                  {t("End Date")}
                                             </label>
                                             <DatePickerField
                                                  name="end_date"
                                                  onChange={(date: Date | null) => {
                                                       const formattedDate = date ? date.toISOString().split('T')[0] : "";
                                                       setFieldValue("end_date", formattedDate);
                                                       setEndDate(formattedDate);
                                                  }}
                                             />
                                        </div>
                                   </div>
                              </Form>
                         )}
                    </Formik>
               </div>

               {/* Stats Cards */}
               {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                         <Spinner size="xxl" />
                    </div>
               ) : ordersData ? (
                    <>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                                   <div className="text-sm text-gray-500 dark:text-gray-400">{t("Total Orders")}</div>
                                   <div className="text-2xl font-bold mt-2">{ordersData.total_orders}</div>
                              </div>

                              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                                   <div className="text-sm text-gray-500 dark:text-gray-400">{t("Pending")}</div>
                                   <div className="text-2xl font-bold mt-2 text-yellow-600">{ordersData.pending_orders}</div>
                              </div>

                              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                                   <div className="text-sm text-gray-500 dark:text-gray-400">{t("Processing")}</div>
                                   <div className="text-2xl font-bold mt-2 text-blue-600">{ordersData.processing_orders}</div>
                              </div>

                              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                                   <div className="text-sm text-gray-500 dark:text-gray-400">{t("Shipped")}</div>
                                   <div className="text-2xl font-bold mt-2 text-purple-600">{ordersData.shipped_orders}</div>
                              </div>

                              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                                   <div className="text-sm text-gray-500 dark:text-gray-400">{t("Delivered")}</div>
                                   <div className="text-2xl font-bold mt-2 text-green-600">{ordersData.delivered_orders}</div>
                              </div>

                              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                                   <div className="text-sm text-gray-500 dark:text-gray-400">{t("Cancelled")}</div>
                                   <div className="text-2xl font-bold mt-2 text-red-600">{ordersData.cancelled_orders}</div>
                              </div>
                         </div>

                         {/* Orders by Payment Status */}
                         {ordersData.by_payment_status && ordersData.by_payment_status.length > 0 && (
                              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                                   <h3 className="text-lg font-semibold mb-4">{t("Orders by Payment Status")}</h3>
                                   <div className="overflow-x-auto">
                                        <table className="w-full">
                                             <thead>
                                                  <tr className="border-b border-gray-200 dark:border-gray-800">
                                                       <th className="text-start py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t("Payment Status")}</th>
                                                       <th className="text-start py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t("Count")}</th>
                                                  </tr>
                                             </thead>
                                             <tbody>
                                                  {ordersData.by_payment_status.map((item: { payment_status: string; count: number }, index: number) => (
                                                       <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                                                            <td className="py-3 px-4">{t(item.payment_status)}</td>
                                                            <td className="py-3 px-4">{item.count}</td>
                                                       </tr>
                                                  ))}
                                             </tbody>
                                        </table>
                                   </div>
                              </div>
                         )}
                    </>
               ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                         {t("No data found...")}
                    </div>
               )}
          </div>
     );
};

export default OrdersReport;
