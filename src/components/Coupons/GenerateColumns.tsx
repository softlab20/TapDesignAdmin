import { ColumnDef } from "@tanstack/react-table";
import { BiEdit } from "react-icons/bi";
import Button from "../ui/button/Button";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState } from "react";
import DeleteMain from "./DeleteMain";
import { useTranslation } from "react-i18next";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Coupon } from "./Types&Validation";
import { FiCalendar, FiTag, FiHash } from "react-icons/fi";
import { MdDiscount } from "react-icons/md";

const GenerateColumns = ({ refetch, setModalOpen, setRow }: {
     refetch: () => void
     setModalOpen: (open: boolean) => void
     setRow: (row: any) => void
}): ColumnDef<Coupon>[] => {
     const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
     const { t } = useTranslation();

     return [
          {
               header: "#",
               accessorKey: "id",
               cell: ({ row }) => row.index + 1,
          },
          {
               header: `${t("Code")}`,
               accessorKey: "code",
               cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                         <FiTag className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                         <span className="font-mono font-semibold bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 px-3 py-1 rounded-lg">
                              {row.original.code}
                         </span>
                    </div>
               ),
          },
          {
               header: `${t("Type")}`,
               accessorKey: "type",
               cell: ({ row }) => {
                    const isFixed = row.original.type === "fixed";
                    return (
                         <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                              isFixed
                                   ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                   : "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                         }`}>
                              <MdDiscount className="w-3.5 h-3.5" />
                              {isFixed ? t("Fixed") : t("Percentage")}
                         </span>
                    );
               },
          },
          {
               header: `${t("Value")}`,
               accessorKey: "value",
               cell: ({ row }) => (
                    <div className="font-semibold text-brand-600 dark:text-brand-400">
                         {row.original.type === "percentage" 
                              ? `${row.original.value}%` 
                              : `${parseFloat(row.original.value).toFixed(2)} ${t("EGP")}`
                         }
                    </div>
               ),
          },
          {
               header: `${t("Count")}`,
               accessorKey: "count",
               cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                         <FiHash className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                         <span className="font-medium">{row.original.count}</span>
                    </div>
               ),
          },
          {
               header: `${t("From Date")}`,
               accessorKey: "from_date",
               cell: ({ row }) => {
                    const date = new Date(row.original.from_date);
                    return (
                         <div className="flex items-center gap-2 text-sm">
                              <FiCalendar className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                              <span>{date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                         </div>
                    );
               },
          },
          {
               header: `${t("To Date")}`,
               accessorKey: "to_date",
               cell: ({ row }) => {
                    const date = new Date(row.original.to_date);
                    const isExpired = new Date() > date;
                    return (
                         <div className={`flex items-center gap-2 text-sm ${
                              isExpired ? "text-red-600 dark:text-red-400" : ""
                         }`}>
                              <FiCalendar className="w-3.5 h-3.5" />
                              <span>{date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                         </div>
                    );
               },
          },
          {
               header: `${t("Created At")}`,
               accessorKey: "created_at",
               cell: ({ row }) => {
                    const date = new Date(row.original.created_at);
                    return (
                         <div className="text-sm text-gray-600 dark:text-gray-400">
                              {date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                         </div>
                    );
               },
          },
          {
               header: t("Actions"),
               accessorKey: "actions",
               cell: ({ row }) => {
                    const couponId = row.original.id;

                    return (
                         <div>
                              <Button
                                   onClick={() =>
                                        setOpenDropdownId(openDropdownId === couponId ? null : couponId)
                                   }
                                   variant="none"
                              >
                                   <BsThreeDotsVertical />
                              </Button>

                              <Dropdown
                                   isOpen={openDropdownId === couponId}
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
                                                  <BiEdit />
                                                  {t("Edit")}
                                             </DropdownItem>
                                        </li>
                                        <li className="border-b border-gray-200 dark:border-gray-800 my-2" />
                                        <li>
                                             <DeleteMain id={couponId} refetch={refetch} />
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