import { ColumnDef } from "@tanstack/react-table";
import { BiEdit } from "react-icons/bi";
import Button from "../ui/button/Button";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState } from "react";
import DeleteMain from "./DeleteMain";
import { useTranslation } from "react-i18next";
import Badge from "../ui/badge/Badge";

const GenerateColumns = ({ refetch, setModalOpen, setRow }: {
     refetch: () => void
     setModalOpen: (open: boolean) => void
     setRow: (row: any) => void
}): ColumnDef<any>[] => {
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
               accessorKey: "full_name",
               cell: ({ row }) => `${row.original.first_name} ${row.original.last_name}`,
          },
          {
               header: `${t("Email")}`,
               accessorKey: "email",
               cell: (info) => info.renderValue(),
          },
          {
               header: `${t("Role")}`,
               accessorKey: "role",
               cell: ({ row }) => row.original.role || "-",
          },
          {
               header: `${t("Activate")}`,
               accessorKey: "is_active",
               cell: (info) => (
                    <Badge
                         color={info.row.original.is_active > 0 ? "success" : "error"}
                         size="md"
                    >
                         {info.row.original.is_active > 0 ? t("Active") : t("Inactive")}
                    </Badge>
               ),
          },

          {
               header: t("Actions"),
               accessorKey: "actions",
               cell: ({ row }) => {
                    const packageId = row.original.id;

                    return (
                         <div>
                              <Button
                                   onClick={() =>
                                        setOpenDropdownId(openDropdownId === packageId ? null : packageId)
                                   }
                                   className="bg-primary hover:bg-primaryDark text-white p-2 rounded"
                              >
                                   ...
                              </Button>

                              <Dropdown
                                   isOpen={openDropdownId === packageId}
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
                                             <DeleteMain refetch={refetch} id={packageId} />
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