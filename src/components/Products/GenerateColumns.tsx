import { ColumnDef } from "@tanstack/react-table";
import { BiEdit } from "react-icons/bi";
import Button from "../ui/button/Button";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState } from "react";
import DeleteMain from "./DeleteMain";
import { useTranslation } from "react-i18next";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Product } from "./Types&Validation";

const GenerateColumns = ({ refetch, setModalOpen, setRow }: {
     refetch: () => void
     setModalOpen: (open: boolean) => void
     setRow: (row: any) => void
}): ColumnDef<Product>[] => {
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
               cell: ({ row }) => (
                    <img
                         src={row.original.web_image}
                         alt={row.original.title_en}
                         className="w-16 h-16 object-cover rounded-lg"
                    />
               ),
          },
          {
               header: `${t("Name")}`,
               accessorKey: "name",
               cell: ({ row }) => {
                    const lang = localStorage.getItem("i18nextLng") || "ar";
                    return <span className="font-medium">{lang === "ar" ? row.original.title_ar : row.original.title_en}</span>;
               },
          },
          {
               header: `${t("Price")}`,
               accessorKey: "price",
               cell: ({ row }) => {
                    const price = Number(row.original.price);
                    const sale = row.original.sale_amount ? Number(row.original.sale_amount) : undefined;
                    const hasSale = sale != null && !isNaN(sale) && sale < price;
                    return (
                         <div>
                              <div className="font-semibold">
                                   {(hasSale ? sale : price).toFixed(2)} {t("EGP")}
                              </div>
                              {hasSale && (
                                   <div className="text-sm text-gray-500 line-through">
                                        {price.toFixed(2)} {t("EGP")}
                                   </div>
                              )}
                         </div>
                    );
               },
          },
          {
               header: `${t("Stock")}`,
               accessorKey: "in_stock",
               cell: ({ row }) => (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${row.original.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                         {row.original.in_stock ? t("In Stock") : t("Out of Stock")}
                    </span>
               ),
          },
          {
               header: `${t("Created At")}`,
               accessorKey: "created_at",
               cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString("ar-EG"),
          },
          {
               header: t("Actions"),
               accessorKey: "actions",
               cell: ({ row }) => {
                    const productId = row.original.id;

                    return (
                         <div>
                              <Button
                                   onClick={() =>
                                        setOpenDropdownId(openDropdownId === productId ? null : productId)
                                   }
                                   variant="none"
                              >
                                   <BsThreeDotsVertical />
                              </Button>

                              <Dropdown
                                   isOpen={openDropdownId === productId}
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
                                             <DeleteMain refetch={refetch} id={productId} />
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