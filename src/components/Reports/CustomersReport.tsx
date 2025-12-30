import { useTranslation } from "react-i18next";
import useFetch from "../../hooks/useFetch";
import { CustomersReportResponse, TopCustomer } from "./Types&Validation";
import Spinner from "../ui/spinner/Spinner";

const CustomersReport = () => {
     const { t } = useTranslation();

     const endpoint = `mcp/reports/customers`;

     const { data, isLoading } = useFetch<CustomersReportResponse>({
          endpoint,
          queryKey: [endpoint],
     });

     const customersData = (data as CustomersReportResponse)?.result?.data;

     return (
          <div className="space-y-6">
               {/* Stats Cards */}
               {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                         <Spinner size="xxl" />
                    </div>
               ) : customersData ? (
                    <>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                                   <div className="text-sm text-gray-500 dark:text-gray-400">{t("Total Customers")}</div>
                                   <div className="text-2xl font-bold mt-2">{customersData.total_customers}</div>
                              </div>

                              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                                   <div className="text-sm text-gray-500 dark:text-gray-400">{t("Active Customers")}</div>
                                   <div className="text-2xl font-bold mt-2 text-green-600">{customersData.active_customers}</div>
                              </div>

                              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                                   <div className="text-sm text-gray-500 dark:text-gray-400">{t("New This Month")}</div>
                                   <div className="text-2xl font-bold mt-2 text-blue-600">{customersData.new_this_month}</div>
                              </div>
                         </div>

                         {/* Top Customers */}
                         {customersData.top_customers && customersData.top_customers.length > 0 && (
                              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                                   <h3 className="text-lg font-semibold mb-4">{t("Top Customers")}</h3>
                                   <div className="overflow-x-auto">
                                        <table className="w-full">
                                             <thead>
                                                  <tr className="border-b border-gray-200 dark:border-gray-800">
                                                       <th className="text-start py-3 px-4 font-medium text-gray-700 dark:text-gray-300">#</th>
                                                       <th className="text-start py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t("Name")}</th>
                                                       <th className="text-start py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t("Email")}</th>
                                                       <th className="text-start py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t("Orders Count")}</th>
                                                       <th className="text-start py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t("Total Spent")}</th>
                                                  </tr>
                                             </thead>
                                             <tbody>
                                                  {customersData.top_customers.map((customer: TopCustomer, index: number) => (
                                                       <tr key={customer.id} className="border-b border-gray-100 dark:border-gray-800">
                                                            <td className="py-3 px-4">{index + 1}</td>
                                                            <td className="py-3 px-4 font-medium">
                                                                 {[customer.first_name, customer.last_name].filter(Boolean).join(" ")}
                                                            </td>
                                                            <td className="py-3 px-4">{customer.email}</td>
                                                            <td className="py-3 px-4">{customer.orders_count}</td>
                                                            <td className="py-3 px-4 font-semibold text-green-600">
                                                                 {Number(customer.total_spent).toFixed(2)} {t("EGP")}
                                                            </td>
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

export default CustomersReport;
