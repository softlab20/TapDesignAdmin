import { useState } from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../../hooks/useFetch";
import { SalesReportResponse } from "./Types&Validation";
import Spinner from "../ui/spinner/Spinner";
import { DatePickerField } from "../ui/form/formik-field/DatePickerField";
import { Formik, Form } from "formik";

const SalesReport = () => {
     const { t } = useTranslation();
     const [startDate, setStartDate] = useState<string>("");
     const [endDate, setEndDate] = useState<string>("");

     const queryParams = new URLSearchParams();
     if (startDate) queryParams.append("start_date", startDate);
     if (endDate) queryParams.append("end_date", endDate);

     const endpoint = `mcp/reports/sales${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

     const { data, isLoading } = useFetch<SalesReportResponse>({
          endpoint,
          queryKey: [endpoint],
     });

     const salesData = (data as SalesReportResponse)?.result?.data;

     return (
          <div className="space-y-6">
               {/* Filters */}
               <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">{t("Filters")}</h3>
                    <Formik
                         initialValues={{ start_date: startDate, end_date: endDate }}
                         onSubmit={() => {}}
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
               ) : salesData ? (
                    <>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                                   <div className="text-sm text-gray-500 dark:text-gray-400">{t("Total Sales")}</div>
                                   <div className="text-2xl font-bold mt-2">{salesData.total_sales}</div>
                              </div>

                              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                                   <div className="text-sm text-gray-500 dark:text-gray-400">{t("Total Revenue")}</div>
                                   <div className="text-2xl font-bold mt-2">{Number(salesData.total_revenue).toFixed(2)} {t("EGP")}</div>
                              </div>

                              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                                   <div className="text-sm text-gray-500 dark:text-gray-400">{t("Average Order Value")}</div>
                                   <div className="text-2xl font-bold mt-2">{Number(salesData.average_order_value).toFixed(2)} {t("EGP")}</div>
                              </div>

                              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                                   <div className="text-sm text-gray-500 dark:text-gray-400">{t("Total Discount")}</div>
                                   <div className="text-2xl font-bold mt-2">{Number(salesData.total_discount).toFixed(2)} {t("EGP")}</div>
                              </div>
                         </div>

                         {/* Sales by Status */}
                         {salesData.by_status && salesData.by_status.length > 0 && (
                              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                                   <h3 className="text-lg font-semibold mb-4">{t("Sales by Status")}</h3>
                                   <div className="overflow-x-auto">
                                        <table className="w-full">
                                             <thead>
                                                  <tr className="border-b border-gray-200 dark:border-gray-800">
                                                       <th className="text-start py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t("Status")}</th>
                                                       <th className="text-start py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t("Count")}</th>
                                                       <th className="text-start py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t("Revenue")}</th>
                                                  </tr>
                                             </thead>
                                             <tbody>
                                                  {salesData.by_status.map((item: { status: string; count: number; revenue: number }, index: number) => (
                                                       <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                                                            <td className="py-3 px-4">{t(item.status)}</td>
                                                            <td className="py-3 px-4">{item.count}</td>
                                                            <td className="py-3 px-4">{Number(item.revenue).toFixed(2)} {t("EGP")}</td>
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

export default SalesReport;
