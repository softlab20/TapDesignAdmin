import { ColumnDef } from "@tanstack/react-table";
import Button from "../ui/button/Button";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Customer } from "./Types&Validation";
import { FiEye } from "react-icons/fi";
import ToggleCustomerStatus from "./ToggleCustomerStatus";

const GenerateColumns = ({ refetch, setModalOpen, setRow }: {
     refetch: () => void
     setModalOpen: (open: boolean) => void
     setRow: (row: any) => void
}): ColumnDef<Customer>[] => {
     const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
     const { t } = useTranslation();

     return [
          {
               header: "#",
               accessorKey: "id",
               cell: ({ row }) => row.index + 1,
          },
          {
               header: `${t("Name")}`,
               accessorKey: "name",
               cell: ({ row }) => (
                    <div className="font-medium text-gray-900 dark:text-white">
                         {row.original.name}
                    </div>
               ),
          },
          {
               header: `${t("Phone")}`,
               accessorKey: "phone",
               cell: ({ row }) => (
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                         📱 {row.original.phone}
                    </div>
               ),
          },
          {
               header: `${t("Status")}`,
               accessorKey: "is_active",
               cell: ({ row }) => (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.original.is_active
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                         }`}>
                         {row.original.is_active ? t("Active") : t("Inactive")}
                    </span>
               ),
          },
          {
               header: `${t("Orders Count")}`,
               accessorKey: "orders",
               cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                         <span className="bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 px-3 py-1 rounded-full text-sm font-semibold">
                              {row.original.orders?.length || 0}
                         </span>
                    </div>
               ),
          },
          {
               header: `${t("Total Spent")}`,
               accessorKey: "total_spent",
               cell: ({ row }) => {
                    const total = row.original.orders?.reduce((sum, order) =>
                         sum + parseFloat(order.total || "0"), 0
                    ) || 0;
                    return (
                         <div className="font-semibold text-brand-600 dark:text-brand-400">
                              {total.toFixed(2)} {t("EGP")}
                         </div>
                    );
               },
          },
          {
               header: `${t("Joined Date")}`,
               accessorKey: "created_at",
               cell: ({ row }) => {
                    const date = new Date(row.original.created_at);
                    return (
                         <div className="text-sm text-gray-600 dark:text-gray-400">
                              {date.toLocaleDateString('ar-EG', {
                                   year: 'numeric',
                                   month: 'short',
                                   day: 'numeric'
                              })}
                         </div>
                    );
               },
          },
          {
               header: t("Actions"),
               accessorKey: "actions",
               cell: ({ row }) => {
                    const customerId = row.original.id;

                    return (
                         <div>
                              <Button
                                   onClick={() =>
                                        setOpenDropdownId(openDropdownId === customerId ? null : customerId)
                                   }
                                   variant="none"
                              >
                                   <BsThreeDotsVertical />
                              </Button>

                              <Dropdown
                                   isOpen={openDropdownId === customerId}
                                   onClose={() => setOpenDropdownId(null)}
                              >
                                   <ul className="w-[250px] relative">
                                        <li>
                                             <DropdownItem
                                                  onClick={() => {
                                                       setRow(row.original);
                                                       setModalOpen(true);
                                                       setOpenDropdownId(null);
                                                  }}
                                                  className="flex items-center gap-2 text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                                             >
                                                  <FiEye />
                                                  {t("View Details")}
                                             </DropdownItem>
                                        </li>
                                        <li className="border-b border-gray-200 dark:border-gray-800 my-2" />
                                        <li>
                                             <ToggleCustomerStatus
                                                  customer={row.original}
                                                  refetch={refetch}
                                                  onClose={() => setOpenDropdownId(null)}
                                             />
                                        </li>
                                   </ul>
                              </Dropdown>
                         </div>
                    );
               },
          },
     ];
};

export default GenerateColumns;