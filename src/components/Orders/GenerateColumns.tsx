import { ColumnDef } from "@tanstack/react-table";
import { Order } from "./Types&Validation";
import PersonalizedProductPreview from "./PersonalizedProductPreview";
import { FiEye, FiMail } from "react-icons/fi";
import DeleteOrder from "./DeleteOrder";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { BiEdit } from "react-icons/bi";
import { useState } from "react";
import Button from "../ui/button/Button";
import { BsThreeDotsVertical } from "react-icons/bs";

export const GenerateColumns = (
     isArabic: boolean,
     onViewDetails: (order: Order) => void,
     onEdit: (order: Order) => void,
     refetch: () => void
): ColumnDef<Order>[] => {
     const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
     const formatCurrency = (value: string | number) => {
          return `$${Number(value).toFixed(2)}`;
     };

     const formatDate = (dateString: string) => {
          return new Date(dateString).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', {
               year: 'numeric',
               month: 'short',
               day: 'numeric'
          });
     };

     const getStatusBadge = (status: string) => {
          const colors = {
               pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
               processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
               completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
               cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          };

          const labels = {
               pending: isArabic ? 'معلق' : 'Pending',
               processing: isArabic ? 'قيد المعالجة' : 'Processing',
               completed: isArabic ? 'مكتمل' : 'Completed',
               cancelled: isArabic ? 'ملغي' : 'Cancelled'
          };

          return (
               <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status as keyof typeof colors] || colors.pending}`}>
                    {labels[status as keyof typeof labels] || status}
               </span>
          );
     };

     const getPaymentStatusBadge = (status: string) => {
          const colors = {
               pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
               paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
               failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          };

          const labels = {
               pending: isArabic ? 'معلق' : 'Pending',
               paid: isArabic ? 'مدفوع' : 'Paid',
               failed: isArabic ? 'فشل' : 'Failed'
          };

          return (
               <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status as keyof typeof colors] || colors.pending}`}>
                    {labels[status as keyof typeof labels] || status}
               </span>
          );
     };

     return [
          {
               accessorKey: "id",
               header: isArabic ? "رقم الطلب" : "Order ID",
               cell: ({ row }) => (
                    <span className="font-semibold text-gray-900 dark:text-white">
                         #{row.original.id}
                    </span>
               ),
          },
          {
               accessorKey: "user",
               header: isArabic ? "العميل" : "Customer",
               cell: ({ row }) => (
                    <div className="flex flex-col">
                         <span className="font-medium text-gray-900 dark:text-white">
                              {row.original.user.name || (isArabic ? 'غير محدد' : 'Not specified')}
                         </span>
                         <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <FiMail className="w-3 h-3" />
                              {row.original.user.email}
                         </span>
                    </div>
               ),
          },
          {
               accessorKey: "items",
               header: isArabic ? "المنتجات" : "Products",
               cell: ({ row }) => (
                    <div className="flex gap-1">
                         {row.original.items.slice(0, 3).map((item) => (
                              <div key={item.id}>
                                   <PersonalizedProductPreview item={item} size="small" />
                              </div>
                         ))}
                         {row.original.items.length > 3 && (
                              <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-400">
                                   +{row.original.items.length - 3}
                              </div>
                         )}
                    </div>
               ),
          },
          {
               accessorKey: "status",
               header: isArabic ? "حالة الطلب" : "Order Status",
               cell: ({ row }) => getStatusBadge(row.original.status),
          },
          {
               accessorKey: "payment_status",
               header: isArabic ? "حالة الدفع" : "Payment Status",
               cell: ({ row }) => getPaymentStatusBadge(row.original.payment_status),
          },
          {
               accessorKey: "total",
               header: isArabic ? "الإجمالي" : "Total",
               cell: ({ row }) => (
                    <div className="flex flex-col">
                         <span className="font-bold text-gray-900 dark:text-white">
                              {formatCurrency(row.original.total)}
                         </span>
                         {Number(row.original.discount_amount) > 0 && (
                              <span className="text-xs text-green-600 dark:text-green-400">
                                   {isArabic ? 'خصم:' : 'Discount:'} {formatCurrency(row.original.discount_amount)}
                              </span>
                         )}
                    </div>
               ),
          },
          {
               accessorKey: "created_at",
               header: isArabic ? "التاريخ" : "Date",
               cell: ({ row }) => (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                         {formatDate(row.original.created_at)}
                    </span>
               ),
          },
          {
               id: "actions",
               header: isArabic ? "الإجراءات" : "Actions",
               cell: ({ row }) => {
                    const orderId = row.original.id;

                    return (
                         <div>
                              <Button
                                   onClick={() =>
                                        setOpenDropdownId(openDropdownId === orderId ? null : orderId)
                                   }
                                   variant="none"
                              >
                                   <BsThreeDotsVertical />
                              </Button>

                              <Dropdown
                                   isOpen={openDropdownId === orderId}
                                   onClose={() => setOpenDropdownId(null)}
                              >
                                   <ul className="w-[250px] relative">
                                        <li>
                                             <DropdownItem
                                                  onClick={() => {
                                                       onViewDetails(row.original);
                                                       setOpenDropdownId(null);
                                                  }}
                                                  className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                             >
                                                  <FiEye />
                                                  {isArabic ? 'عرض التفاصيل' : 'View Details'}
                                             </DropdownItem>
                                        </li>
                                        <li>
                                             <DropdownItem
                                                  onClick={() => {
                                                       onEdit(row.original);
                                                       setOpenDropdownId(null);
                                                  }}
                                                  className="flex items-center gap-2 text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                                             >
                                                  <BiEdit />
                                                  {isArabic ? 'تعديل' : 'Edit'}
                                             </DropdownItem>
                                        </li>
                                        <li className="border-b border-gray-200 dark:border-gray-800 my-2" />
                                        <li>
                                             <DeleteOrder refetch={refetch} id={orderId} />
                                        </li>
                                   </ul>
                              </Dropdown>
                         </div>
                    );
               },
          },
     ];
};
