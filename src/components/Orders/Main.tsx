import { useState } from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../../hooks/useFetch";
import { Order, OrdersResponse } from "./Types&Validation";
import { GenerateColumns } from "./GenerateColumns";
import OrderDetailsModal from "./OrderDetailsModal";
import OrderFormModal from "./OrderFormModal";
import IndexTable from "../ui/IndexTable";
import Button from "../ui/button/Button";
import { FiPlus } from "react-icons/fi";

const Main = () => {
     const { i18n } = useTranslation();
     const isArabic = i18n.language === 'ar';
     const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
     const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
     const [isFormModalOpen, setIsFormModalOpen] = useState(false);
     const [editingOrder, setEditingOrder] = useState<Order | null>(null);

     // Fetch orders data
     const { data, isLoading, isError, refetch } = useFetch<any>({
          endpoint: "mcp/orders",
          queryKey: ["orders"],
          select: (response: any) => response?.result as OrdersResponse["result"],
     });

     const ordersData = data as OrdersResponse["result"] | undefined;
     const orders = ordersData?.data || [];

     const handleViewDetails = (order: Order) => {
          setSelectedOrder(order);
          setIsDetailsModalOpen(true);
     };

     const handleEdit = (order: Order) => {
          setEditingOrder(order);
          setIsFormModalOpen(true);
     };

     const handleCreateNew = () => {
          setEditingOrder(null);
          setIsFormModalOpen(true);
     };

     const handleCloseDetailsModal = () => {
          setIsDetailsModalOpen(false);
          setSelectedOrder(null);
     };

     const handleCloseFormModal = () => {
          setIsFormModalOpen(false);
          setEditingOrder(null);
     };

     const columns = GenerateColumns(isArabic, handleViewDetails, handleEdit, refetch);

     if (isError) {
          return (
               <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                    <p className="text-red-600 dark:text-red-400">
                         {isArabic ? 'حدث خطأ أثناء تحميل الطلبات' : 'Error loading orders'}
                    </p>
               </div>
          );
     }

     return (
          <>
               <div className="space-y-6">
                    {/* Header with Create Button */}
                    <div className="flex items-center justify-between">
                         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                              {isArabic ? 'قائمة الطلبات' : 'Orders List'}
                         </h1>
                         <Button onClick={handleCreateNew} className="flex items-center gap-2">
                              <FiPlus className="w-5 h-5" />
                              {isArabic ? 'إنشاء طلب جديد' : 'Create New Order'}
                         </Button>
                    </div>

                    {/* Orders Table */}
                    <div>
                         <IndexTable
                              data={orders}
                              columns={columns as any}
                              isLoading={isLoading}
                              title=""
                         />
                    </div>

                    {/* Pagination Info */}
                    {ordersData?.meta && (
                         <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                              <span>
                                   {isArabic
                                        ? `عرض ${ordersData.meta.from} إلى ${ordersData.meta.to} من ${ordersData.meta.total} طلب`
                                        : `Showing ${ordersData.meta.from} to ${ordersData.meta.to} of ${ordersData.meta.total} orders`}
                              </span>
                              <span>
                                   {isArabic
                                        ? `الصفحة ${ordersData.meta.current_page} من ${ordersData.meta.last_page}`
                                        : `Page ${ordersData.meta.current_page} of ${ordersData.meta.last_page}`}
                              </span>
                         </div>
                    )}
               </div>

               {/* Order Details Modal */}
               <OrderDetailsModal
                    order={selectedOrder}
                    isOpen={isDetailsModalOpen}
                    onClose={handleCloseDetailsModal}
               />

               {/* Order Form Modal (Create/Edit) */}
               <OrderFormModal
                    isOpen={isFormModalOpen}
                    onClose={handleCloseFormModal}
                    order={editingOrder}
                    refetch={refetch}
               />
          </>
     );
};

export default Main;
