import { useTranslation } from "react-i18next";
import { Customer } from "./Types&Validation";
import { FiUser, FiPhone, FiShoppingBag, FiMapPin, FiCalendar, FiClock, FiPackage } from "react-icons/fi";
import { MdDiscount } from "react-icons/md";
import { BiDollar } from "react-icons/bi";
import { Modal } from "../ui/modal";

interface CustomerDetailsModalProps {
     customer: Customer | null;
     isOpen: boolean;
     onClose: () => void;
}

const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({ customer, isOpen, onClose }) => {
     const { t } = useTranslation();

     if (!customer) return null;

     const getStatusConfig = (status: string) => {
          const configs: Record<string, { bg: string; text: string; icon: string }> = {
               pending: {
                    bg: "bg-yellow-50 dark:bg-yellow-900/20",
                    text: "text-yellow-700 dark:text-yellow-400",
                    icon: "⏳"
               },
               processing: {
                    bg: "bg-blue-50 dark:bg-blue-900/20",
                    text: "text-blue-700 dark:text-blue-400",
                    icon: "🔄"
               },
               completed: {
                    bg: "bg-green-50 dark:bg-green-900/20",
                    text: "text-green-700 dark:text-green-400",
                    icon: "✅"
               },
               cancelled: {
                    bg: "bg-red-50 dark:bg-red-900/20",
                    text: "text-red-700 dark:text-red-400",
                    icon: "❌"
               },
          };
          return configs[status] || configs.pending;
     };

     const statusLabels: Record<string, string> = {
          pending: t("Pending"),
          processing: t("Processing"),
          completed: t("Completed"),
          cancelled: t("Cancelled"),
     };

     const totalSpent = customer.orders?.reduce((sum, order) => sum + parseFloat(order.total || "0"), 0) || 0;

     return (
          <Modal isOpen={isOpen} onClose={onClose} isFullscreen>
               <div className="bg-white dark:bg-gray-800 h-full overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-brand-500 to-brand-600 dark:from-brand-600 dark:to-brand-700 p-6">
                         <div className="flex items-center gap-3">
                              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                                   <FiUser className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                   <h2 className="text-2xl font-bold text-white">{t("Customer Details")}</h2>
                                   <p className="text-white/80 text-sm">{customer.name}</p>
                              </div>
                         </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 overflow-y-auto flex-1">
                         {/* Customer Info */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                                   <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
                                        <FiUser className="w-4 h-4" />
                                        <span className="text-xs font-medium">{t("Name")}</span>
                                   </div>
                                   <p className="text-lg font-semibold text-gray-900 dark:text-white">{customer.name}</p>
                              </div>

                              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                                   <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
                                        <FiPhone className="w-4 h-4" />
                                        <span className="text-xs font-medium">{t("Phone")}</span>
                                   </div>
                                   <p className="text-lg font-semibold text-gray-900 dark:text-white">{customer.phone}</p>
                              </div>

                              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                                   <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
                                        <FiShoppingBag className="w-4 h-4" />
                                        <span className="text-xs font-medium">{t("Orders Count")}</span>
                                   </div>
                                   <p className="text-lg font-semibold text-brand-600 dark:text-brand-400">
                                        {customer.orders?.length || 0} {t("Orders")}
                                   </p>
                              </div>

                              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                                   <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
                                        <BiDollar className="w-4 h-4" />
                                        <span className="text-xs font-medium">{t("Total Spent")}</span>
                                   </div>
                                   <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                                        {totalSpent.toFixed(2)} {t("EGP")}
                                   </p>
                              </div>
                         </div>

                         {/* Orders Section */}
                         <div className="mb-4">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                   <FiShoppingBag className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                                   {t("Orders History")}
                              </h3>

                              {customer.orders && customer.orders.length > 0 ? (
                                   <div className="space-y-4 overflow-y-auto">
                                        {customer.orders.map((order) => {
                                             const statusConfig = getStatusConfig(order.status);
                                             const date = new Date(order.created_at);
                                             const totalItems = order.items.reduce((sum, item) => sum + item.count, 0);

                                             return (
                                                  <div
                                                       key={order.id}
                                                       className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                                                  >
                                                       {/* Order Header */}
                                                       <div className="flex justify-between items-start mb-3">
                                                            <div className="flex items-center gap-2">
                                                                 <span className="font-bold text-gray-900 dark:text-white">
                                                                      #{order.id}
                                                                 </span>
                                                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                                                                      {statusConfig.icon} {statusLabels[order.status]}
                                                                 </span>
                                                            </div>
                                                            <div className="text-right">
                                                                 <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                                      <FiCalendar className="w-3 h-3" />
                                                                      <span>{date.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })}</span>
                                                                 </div>
                                                                 <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                                      <FiClock className="w-3 h-3" />
                                                                      <span>{date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                                                                 </div>
                                                            </div>
                                                       </div>

                                                       {/* Order Items */}
                                                       <div className="mb-3">
                                                            <div className="flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                 <FiPackage className="w-3 h-3" />
                                                                 {totalItems} {t("Items")}
                                                            </div>
                                                            <div className="space-y-1">
                                                                 {order.items.slice(0, 2).map((item, idx) => (
                                                                      <div key={idx} className="flex items-center justify-between text-sm">
                                                                           <div className="flex items-center gap-2">
                                                                                {item.product?.web_image && (
                                                                                     <img
                                                                                          src={item.product.web_image}
                                                                                          alt={item.product.name}
                                                                                          className="w-8 h-8 rounded object-cover"
                                                                                     />
                                                                                )}
                                                                                <span className="text-gray-700 dark:text-gray-300">
                                                                                     {item.product?.name || `#${item.product_id}`}
                                                                                </span>
                                                                           </div>
                                                                           <span className="text-gray-500 dark:text-gray-400">
                                                                                {item.count}× {parseFloat(item.price).toFixed(2)}
                                                                           </span>
                                                                      </div>
                                                                 ))}
                                                                 {order.items.length > 2 && (
                                                                      <p className="text-xs text-brand-600 dark:text-brand-400">
                                                                           +{order.items.length - 2} {t("more")}
                                                                      </p>
                                                                 )}
                                                            </div>
                                                       </div>

                                                       {/* Order Totals */}
                                                       <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-1">
                                                            <div className="flex justify-between text-xs">
                                                                 <span className="text-gray-600 dark:text-gray-400">{t("Subtotal")}</span>
                                                                 <span className="font-medium">{parseFloat(order.subtotal).toFixed(2)}</span>
                                                            </div>
                                                            {parseFloat(order.discount_amount) > 0 && (
                                                                 <div className="flex justify-between text-xs text-red-600 dark:text-red-400">
                                                                      <span className="flex items-center gap-1">
                                                                           <MdDiscount className="w-3 h-3" />
                                                                           {t("Discount")}
                                                                      </span>
                                                                      <span>-{parseFloat(order.discount_amount).toFixed(2)}</span>
                                                                 </div>
                                                            )}
                                                            <div className="flex justify-between font-bold text-brand-600 dark:text-brand-400">
                                                                 <span>{t("Total")}</span>
                                                                 <span>{parseFloat(order.total).toFixed(2)} {t("EGP")}</span>
                                                            </div>
                                                       </div>
                                                  </div>
                                             );
                                        })}
                                   </div>
                              ) : (
                                   <div className="text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                        <FiShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-500 dark:text-gray-400">{t("No orders found")}</p>
                                   </div>
                              )}
                         </div>

                         {/* Addresses Section */}
                         {customer.addresses && customer.addresses.length > 0 && (
                              <div>
                                   <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <FiMapPin className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                                        {t("Addresses")}
                                   </h3>
                                   <div className="space-y-2">
                                        {customer.addresses.map((address) => (
                                             <div
                                                  key={address.id}
                                                  className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg flex items-start gap-2"
                                             >
                                                  <FiMapPin className="w-4 h-4 text-brand-600 dark:text-brand-400 mt-1" />
                                                  <p className="text-gray-700 dark:text-gray-300">{address.address}</p>
                                             </div>
                                        ))}
                                   </div>
                              </div>
                         )}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                         <button
                              onClick={onClose}
                              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                         >
                              {t("Close")}
                         </button>
                    </div>
               </div>
          </Modal>
     );
};

export default CustomerDetailsModal;
