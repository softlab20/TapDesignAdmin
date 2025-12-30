import { useState } from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../../hooks/useFetch";
import { RevenueReportResponse, RevenueDataPoint } from "./Types&Validation";
import Spinner from "../ui/spinner/Spinner";

const RevenueReport = () => {
     const { t } = useTranslation();
     const [days, setDays] = useState<string>("30");

     const endpoint = `mcp/reports/revenue?days=${days}`;

     const { data, isLoading } = useFetch<RevenueReportResponse>({
          endpoint,
          queryKey: [endpoint],
     });

     const revenueData = (data as RevenueReportResponse)?.result?.data || [];

     const totalRevenue = revenueData.reduce((sum: number, item: RevenueDataPoint) => sum + Number(item.revenue), 0);
     const totalOrders = revenueData.reduce((sum: number, item: RevenueDataPoint) => sum + item.orders_count, 0);

     return (
          <div className="space-y-6">
               {/* Filter */}
               <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">{t("Filters")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                         <button
                              onClick={() => setDays("7")}
                              className={`px-4 py-2 rounded-lg font-medium transition ${days === "7"
                                        ? "bg-brand-500 text-white"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                   }`}
                         >
                              {t("Last 7 Days")}
                         </button>
                         <button
                              onClick={() => setDays("30")}
                              className={`px-4 py-2 rounded-lg font-medium transition ${days === "30"
                                        ? "bg-brand-500 text-white"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                   }`}
                         >
                              {t("Last 30 Days")}
                         </button>
                         <button
                              onClick={() => setDays("90")}
                              className={`px-4 py-2 rounded-lg font-medium transition ${days === "90"
                                        ? "bg-brand-500 text-white"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                   }`}
                         >
                              {t("Last 90 Days")}
                         </button>
                         <button
                              onClick={() => setDays("365")}
                              className={`px-4 py-2 rounded-lg font-medium transition ${days === "365"
                                        ? "bg-brand-500 text-white"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                   }`}
                         >
                              {t("Last Year")}
                         </button>
                    </div>
               </div>

               {/* Summary Cards */}
               {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                         <Spinner size="xxl" />
                    </div>
               ) : revenueData.length > 0 ? (
                    <>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                                   <div className="text-sm text-gray-500 dark:text-gray-400">{t("Total Revenue")}</div>
                                   <div className="text-2xl font-bold mt-2 text-green-600">{totalRevenue.toFixed(2)} {t("EGP")}</div>
                              </div>

                              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                                   <div className="text-sm text-gray-500 dark:text-gray-400">{t("Total Orders")}</div>
                                   <div className="text-2xl font-bold mt-2">{totalOrders}</div>
                              </div>
                         </div>

                         {/* Revenue Table */}
                         <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                              <h3 className="text-lg font-semibold mb-4">{t("Daily Revenue")}</h3>
                              <div className="overflow-x-auto">
                                   <table className="w-full">
                                        <thead>
                                             <tr className="border-b border-gray-200 dark:border-gray-800">
                                                  <th className="text-start py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t("Date")}</th>
                                                  <th className="text-start py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t("Orders")}</th>
                                                  <th className="text-start py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t("Revenue")}</th>
                                             </tr>
                                        </thead>
                                        <tbody>
                                             {revenueData.map((item: RevenueDataPoint, index: number) => (
                                                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                                                       <td className="py-3 px-4">{new Date(item.date).toLocaleDateString("ar-EG")}</td>
                                                       <td className="py-3 px-4">{item.orders_count}</td>
                                                       <td className="py-3 px-4 font-semibold text-green-600">
                                                            {Number(item.revenue).toFixed(2)} {t("EGP")}
                                                       </td>
                                                  </tr>
                                             ))}
                                        </tbody>
                                   </table>
                              </div>
                         </div>
                    </>
               ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                         {t("No data found...")}
                    </div>
               )}
          </div>
     );
};

export default RevenueReport;
