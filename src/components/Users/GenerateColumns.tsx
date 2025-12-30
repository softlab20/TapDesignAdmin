import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BsThreeDotsVertical } from "react-icons/bs";
import Button from "../ui/button/Button";
import { Dropdown } from "../ui/dropdown/Dropdown";
import DeleteMain from "./DeleteMain";
import { User } from "./Types&Validation";

const GenerateColumns = ({ refetch }: { refetch: () => void }): ColumnDef<User>[] => {
     const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
     const { t } = useTranslation();

     return [
          {
               header: "#",
               accessorKey: "id",
               cell: ({ row }) => row.index + 1,
          },
          {
               header: t("Name"),
               accessorKey: "first_name",
               cell: ({ row }) => (
                    <span className="font-medium">
                         {[row.original.first_name, row.original.last_name].filter(Boolean).join(" ")}
                    </span>
               ),
          },
          {
               header: t("Email"),
               accessorKey: "email",
               cell: ({ row }) => <span className="break-all">{row.original.email}</span>,
          },
          {
               header: t("Status"),
               accessorKey: "is_active",
               cell: ({ row }) => (
                    <span
                         className={`px-2.5 py-1 rounded-full text-xs font-medium ${row.original.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                         {row.original.is_active ? t("Active") : t("Inactive")}
                    </span>
               ),
          },
          {
               header: t("Created At"),
               accessorKey: "created_at",
               cell: ({ row }) => new Date(row.original.created_at).toLocaleString("ar-EG"),
          },
          {
               header: t("Actions"),
               accessorKey: "actions",
               cell: ({ row }) => {
                    const userId = row.original.id;

                    return (
                         <div>
                              <Button
                                   onClick={() =>
                                        setOpenDropdownId(openDropdownId === userId ? null : userId)
                                   }
                                   variant="none"
                              >
                                   <BsThreeDotsVertical />
                              </Button>

                              <Dropdown
                                   isOpen={openDropdownId === userId}
                                   onClose={() => setOpenDropdownId(null)}
                              >
                                   <ul className="w-[180px] relative">
                                        <li>
                                             <DeleteMain
                                                  refetch={() => {
                                                       refetch();
                                                       setOpenDropdownId(null);
                                                  }}
                                                  id={userId}
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