import { ColumnDef } from "@tanstack/react-table";
import Button from "../ui/button/Button";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useState } from "react";
import DeleteMain from "./DeleteMain";
import { useTranslation } from "react-i18next";
import { BsThreeDotsVertical } from "react-icons/bs";
import { ContactItem } from "./Types&Validation";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

const GenerateColumns = ({ refetch, setModalOpen, setRow }: {
     refetch: () => void;
     setModalOpen: (open: boolean) => void;
     setRow: (row: any) => void;
}): ColumnDef<ContactItem>[] => {
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
                    <span className="font-medium">{`${row.original.first_name} ${row.original.last_name}`}</span>
               ),
          },
          {
               header: `${t("Email")}`,
               accessorKey: "email",
               cell: ({ row }) => (
                    <span className="text-gray-700 dark:text-gray-300">{row.original.email}</span>
               ),
          },
          {
               header: `${t("Message")}`,
               accessorKey: "message",
               cell: ({ row }) => (
                    <div className="text-gray-700 dark:text-gray-300 max-w-[280px] truncate" title={row.original.message}>
                         {row.original.message}
                    </div>
               ),
          },
          {
               header: t("Actions"),
               accessorKey: "actions",
               cell: ({ row }) => {
                    const contactId = row.original.id;

                    return (
                         <div>
                              <Button
                                   onClick={() =>
                                        setOpenDropdownId(openDropdownId === contactId ? null : contactId)
                                   }
                                   variant="none"
                              >
                                   <BsThreeDotsVertical />
                              </Button>

                              <Dropdown
                                   isOpen={openDropdownId === contactId}
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
                                                  {t("View Message")}
                                             </DropdownItem>
                                        </li>
                                        <li className="border-b border-gray-200 dark:border-gray-800 my-2" />
                                        <li>
                                             <DeleteMain id={contactId} refetch={refetch} />
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