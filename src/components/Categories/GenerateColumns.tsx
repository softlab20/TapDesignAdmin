import { ColumnDef } from "@tanstack/react-table";
import { BiEdit } from "react-icons/bi";
import Button from "../ui/button/Button";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState } from "react";
import DeleteMain from "./DeleteMain";
import { useTranslation } from "react-i18next";
import { BsThreeDotsVertical } from "react-icons/bs";

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
               header: `${t("Image")}`,
               accessorKey: "web_image",
               cell: ({ row }) => {
                    return row.original.web_image ? (
                         <img 
                              src={row.original.web_image} 
                              alt={row.original.title_en}
                              className="w-12 h-12 object-cover rounded-lg"
                         />
                    ) : (
                         <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400 text-xs">{t("No Image")}</span>
                         </div>
                    );
               },
          },
          {
               header: `${t("Name")}`,
               accessorKey: "name",
               cell: ({ row }) => {
                    const currentLang = localStorage.getItem('i18nextLng') || 'ar';
                    return currentLang === 'ar' ? row.original.title_ar : row.original.title_en;
               },
          },
          {
               header: `${t("Created At")}`,
               accessorKey: "created_at",
               cell: (info) => {
                    const date = new Date(info.getValue() as string);
                    return date.toLocaleDateString('en-EG');
               },
          },
          {
               header: `${t("Updated At")}`,
               accessorKey: "updated_at",
               cell: (info) => {
                    const date = new Date(info.getValue() as string);
                    return date.toLocaleDateString('en-EG');
               },
          },

          {
               header: t("Actions"),
               accessorKey: "actions",
               cell: ({ row }) => {
                    const categoryId = row.original.id;

                    return (
                         <div>
                              <Button
                                   onClick={() =>
                                        setOpenDropdownId(openDropdownId === categoryId ? null : categoryId)
                                   }
                                   variant="none"
                              >
                                   <BsThreeDotsVertical />
                              </Button>

                              <Dropdown
                                   isOpen={openDropdownId === categoryId}
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
                                             <DeleteMain refetch={refetch} id={categoryId} />
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