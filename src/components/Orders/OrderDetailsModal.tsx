import { useTranslation } from "react-i18next";
import { Order } from "./Types&Validation";
import PersonalizedProductPreview from "./PersonalizedProductPreview";
import { FiUser, FiMail, FiCalendar, FiDollarSign, FiTag } from "react-icons/fi";
import { Modal } from "../ui/modal";

interface OrderDetailsModalProps {
     order: Order | null;
     isOpen: boolean;
     onClose: () => void;
}

const OrderDetailsModal = ({ order, isOpen, onClose }: OrderDetailsModalProps) => {
     const { i18n } = useTranslation();
     const isArabic = i18n.language === 'ar';

     if (!isOpen || !order) return null;

     const formatCurrency = (value: string | number) => {
          return `$${Number(value).toFixed(2)}`;
     };

     const formatDate = (dateString: string) => {
          return new Date(dateString).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', {
               year: 'numeric',
               month: 'long',
               day: 'numeric',
               hour: '2-digit',
               minute: '2-digit'
          });
     };

     const getStatusColor = (status: string) => {
          const colors = {
               pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
               processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
               completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
               cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          };
          return colors[status as keyof typeof colors] || colors.pending;
     };

     const getPaymentStatusColor = (status: string) => {
          const colors = {
               pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
               paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
               failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          };
          return colors[status as keyof typeof colors] || colors.pending;
     };

     const getStatusLabel = (status: string) => {
          const labels = {
               pending: isArabic ? 'معلق' : 'Pending',
               processing: isArabic ? 'قيد المعالجة' : 'Processing',
               completed: isArabic ? 'مكتمل' : 'Completed',
               cancelled: isArabic ? 'ملغي' : 'Cancelled'
          };
          return labels[status as keyof typeof labels] || status;
     };

     const getPaymentStatusLabel = (status: string) => {
          const labels = {
               pending: isArabic ? 'معلق' : 'Pending',
               paid: isArabic ? 'مدفوع' : 'Paid',
               failed: isArabic ? 'فشل' : 'Failed'
          };
          return labels[status as keyof typeof labels] || status;
     };

     return (
          <Modal isOpen={isOpen} onClose={onClose} isFullscreen={true} showCloseButton={true}>
               {/* Header */}
               <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
                    <div>
                         <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                              <span className="text-blue-600 dark:text-blue-400">#</span>
                              {order.id}
                         </h2>
                         <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                              <FiCalendar className="w-4 h-4" />
                              {formatDate(order.created_at)}
                         </p>
                    </div>
               </div>

               {/* Content */}
               <div className="p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
                         {/* Customer Info & Status */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                              {/* Customer Info */}
                              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                                   <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                             <FiUser className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        {isArabic ? 'معلومات العميل' : 'Customer Information'}
                                   </h3>
                                   <div className="space-y-3">
                                        <div className="flex items-center text-sm bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                             <FiUser className="mr-3 text-gray-400" />
                                             <span className="text-gray-700 dark:text-gray-300 font-medium">
                                                  {order.user.name || (isArabic ? 'غير محدد' : 'Not specified')}
                                             </span>
                                        </div>
                                        <div className="flex items-center text-sm bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                             <FiMail className="mr-3 text-gray-400" />
                                             <span className="text-gray-700 dark:text-gray-300">{order.user.email}</span>
                                        </div>
                                   </div>
                              </div>

                              {/* Order Status */}
                              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                                   <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                             <FiTag className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        </div>
                                        {isArabic ? 'حالة الطلب' : 'Order Status'}
                                   </h3>
                                   <div className="space-y-3">
                                        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                             <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                                  {isArabic ? 'حالة الطلب:' : 'Order Status:'}
                                             </span>
                                             <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${getStatusColor(order.status)}`}>
                                                  {getStatusLabel(order.status)}
                                             </span>
                                        </div>
                                        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                             <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                                  {isArabic ? 'حالة الدفع:' : 'Payment Status:'}
                                             </span>
                                             <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${getPaymentStatusColor(order.payment_status)}`}>
                                                  {getPaymentStatusLabel(order.payment_status)}
                                             </span>
                                        </div>
                                   </div>
                              </div>
                         </div>

                         {/* Order Items */}
                         <div className="mb-6">
                              <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">
                                   {isArabic ? 'منتجات الطلب' : 'Order Items'}
                              </h3>
                              <div className="space-y-4">
                                   {order.items.map((item) => (
                                        <div
                                             key={item.id}
                                             className="flex gap-6 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                                        >
                                             {/* Product Image */}
                                             <div className="flex-shrink-0">
                                                  <PersonalizedProductPreview 
                                                       item={item} 
                                                       size={item.is_personalized ? "large" : "medium"} 
                                                  />
                                             </div>

                                             {/* Product Details */}
                                             <div className="flex-1">
                                                  <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3">
                                                       {isArabic ? item.product_title_ar : item.product_title_en}
                                                  </h4>
                                                  <div className="grid grid-cols-2 gap-3">
                                                       <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                                            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                                                                 {isArabic ? 'السعر' : 'Price'}
                                                            </span>
                                                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                                 {formatCurrency(item.unit_price)}
                                                            </span>
                                                       </div>
                                                       <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                                            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                                                                 {isArabic ? 'الكمية' : 'Quantity'}
                                                            </span>
                                                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                                 {item.quantity}
                                                            </span>
                                                       </div>
                                                       {item.is_personalized && (
                                                            <>
                                                                 <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                                                                      <span className="text-xs text-purple-600 dark:text-purple-400 block mb-1 font-medium">
                                                                           {isArabic ? 'تخصيص' : 'Personalization'}
                                                                      </span>
                                                                      <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
                                                                           +{formatCurrency(item.personalization_price)}
                                                                      </span>
                                                                 </div>
                                                                 {item.selected_color && (
                                                                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                                                                           <span className="text-xs text-blue-600 dark:text-blue-400 block mb-1 font-medium">
                                                                                {isArabic ? 'اللون' : 'Color'}
                                                                           </span>
                                                                           <span className="text-sm font-bold text-blue-700 dark:text-blue-300 capitalize">
                                                                                {item.selected_color}
                                                                           </span>
                                                                      </div>
                                                                 )}
                                                            </>
                                                       )}
                                                  </div>
                                                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between">
                                                       <span className="text-gray-700 dark:text-gray-300 font-bold">
                                                            {isArabic ? 'الإجمالي:' : 'Total:'}
                                                       </span>
                                                       <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                                            {formatCurrency(item.total_price)}
                                                       </span>
                                                  </div>
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         </div>

                         {/* Order Summary */}
                         <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-5 shadow-sm border border-blue-200 dark:border-gray-700">
                              <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg flex items-center gap-2">
                                   <FiDollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                   {isArabic ? 'ملخص الطلب' : 'Order Summary'}
                              </h3>
                              <div className="space-y-3">
                                   <div className="flex items-center justify-between text-sm bg-white dark:bg-gray-700/50 p-3 rounded-lg">
                                        <span className="text-gray-600 dark:text-gray-400 font-medium">
                                             {isArabic ? 'المجموع الفرعي:' : 'Subtotal:'}
                                        </span>
                                        <span className="text-gray-900 dark:text-white font-bold">
                                             {formatCurrency(order.subtotal)}
                                        </span>
                                   </div>
                                   {Number(order.discount_amount) > 0 && (
                                        <div className="flex items-center justify-between text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                                             <span className="text-green-700 dark:text-green-400 font-medium flex items-center gap-2">
                                                  <FiTag className="w-4 h-4" />
                                                  {isArabic ? 'الخصم:' : 'Discount:'}
                                             </span>
                                             <span className="text-green-600 dark:text-green-400 font-bold">
                                                  -{formatCurrency(order.discount_amount)}
                                             </span>
                                        </div>
                                   )}
                                   <div className="flex items-center justify-between text-lg font-bold pt-3 border-t-2 border-blue-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 p-4 rounded-lg">
                                        <span className="text-gray-900 dark:text-white flex items-center gap-2">
                                             <FiDollarSign className="w-5 h-5" />
                                             {isArabic ? 'الإجمالي:' : 'Total:'}
                                        </span>
                                        <span className="text-blue-600 dark:text-blue-400 text-2xl">
                                             {formatCurrency(order.total)}
                                        </span>
                                   </div>
                              </div>
                         </div>

                         {/* Notes */}
                         {order.notes && (
                              <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                   <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                        {isArabic ? 'ملاحظات:' : 'Notes:'}
                                   </h3>
                                   <p className="text-sm text-gray-700 dark:text-gray-300">{order.notes}</p>
                              </div>
                         )}
                    </div>

               {/* Footer */}
               <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <button
                         onClick={onClose}
                         className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                         {isArabic ? 'إغلاق' : 'Close'}
                    </button>
               </div>
               </Modal>
     );
};

export default OrderDetailsModal;
