import { useTranslation } from "react-i18next";
import useFetch from "../../hooks/useFetch";
import { ProductsReportResponse, TopSellingProduct } from "./Types&Validation";
import Spinner from "../ui/spinner/Spinner";

const ProductsReport = () => {
     const { t } = useTranslation();
     const lang = localStorage.getItem("i18nextLng") || "ar";

     const endpoint = `mcp/reports/products`;

     const { data, isLoading } = useFetch<ProductsReportResponse>({
          endpoint,
          queryKey: [endpoint],
     });

     const productsData = (data as ProductsReportResponse)?.result?.data;

     return (
          <div className="space-y-6">
               {/* Stats Cards */}
               {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                         <Spinner size="xxl" />
                    </div>
               ) : productsData ? (
                    <>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                                   <div className="text-sm text-gray-500 dark:text-gray-400">{t("Total Products")}</div>
                                   <div className="text-2xl font-bold mt-2">{productsData.total_products}</div>
                              </div>

                              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                                   <div className="text-sm text-gray-500 dark:text-gray-400">{t("In Stock")}</div>
                                   <div className="text-2xl font-bold mt-2 text-green-600">{productsData.in_stock}</div>
                              </div>

                              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                                   <div className="text-sm text-gray-500 dark:text-gray-400">{t("Out of Stock")}</div>
                                   <div className="text-2xl font-bold mt-2 text-red-600">{productsData.out_of_stock}</div>
                              </div>
                         </div>

                         {/* Top Selling Products */}
                         {productsData.top_selling && productsData.top_selling.length > 0 && (
                              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                                   <h3 className="text-lg font-semibold mb-4">{t("Top Selling Products")}</h3>
                                   <div className="overflow-x-auto">
                                        <table className="w-full">
                                             <thead>
                                                  <tr className="border-b border-gray-200 dark:border-gray-800">
                                                       <th className="text-start py-3 px-4 font-medium text-gray-700 dark:text-gray-300">#</th>
                                                       <th className="text-start py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t("Image")}</th>
                                                       <th className="text-start py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t("Name")}</th>
                                                       <th className="text-start py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t("Price")}</th>
                                                       <th className="text-start py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t("Orders")}</th>
                                                       <th className="text-start py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t("Total Sold")}</th>
                                                       <th className="text-start py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{t("Revenue")}</th>
                                                  </tr>
                                             </thead>
                                             <tbody>
                                                  {productsData.top_selling.map((product: TopSellingProduct, index: number) => (
                                                       <tr key={product.id} className="border-b border-gray-100 dark:border-gray-800">
                                                            <td className="py-3 px-4">{index + 1}</td>
                                                            <td className="py-3 px-4">
                                                                 {product.main_image ? (
                                                                      <img
                                                                           src={`${import.meta.env.VITE_URL}${product.main_image}`}
                                                                           alt={lang === "ar" ? product.title_ar : product.title_en}
                                                                           className="w-12 h-12 object-cover rounded-lg"
                                                                      />
                                                                 ) : (
                                                                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-500">
                                                                           {t("No Image")}
                                                                      </div>
                                                                 )}
                                                            </td>
                                                            <td className="py-3 px-4 font-medium">
                                                                 {lang === "ar" ? product.title_ar : product.title_en}
                                                            </td>
                                                            <td className="py-3 px-4">{Number(product.price).toFixed(2)} {t("EGP")}</td>
                                                            <td className="py-3 px-4">{product.orders_count}</td>
                                                            <td className="py-3 px-4">{product.total_sold || 0}</td>
                                                            <td className="py-3 px-4 font-semibold text-green-600">
                                                                 {product.total_revenue ? `${Number(product.total_revenue).toFixed(2)} ${t("EGP")}` : "-"}
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

export default ProductsReport;
