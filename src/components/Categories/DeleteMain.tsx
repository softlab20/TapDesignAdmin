import { BiTrash } from "react-icons/bi";
import Swal from "sweetalert2";
import { useMutate } from "../../hooks/useMutate";
import { useTheme } from "../../context/ThemeContext";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { t } from "i18next";

interface DeleteMainProps {
     id: number;
     refetch: any;
}

const DeleteMain = ({ id, refetch }: DeleteMainProps) => {
     const { theme } = useTheme();
     const { mutate } = useMutate({
          endpoint: `mcp/categories/${id}`,
          mutationKey: ["mcp/categories"],
          method: "delete",
          onSuccess: () => {
               Swal.fire({
                    title: t("deleted!"),
                    text: t("The item has been deleted successfully."),
                    icon: "success",
                    background: theme == "dark" ? "#1A1A1A" : "#fff",
                    color: theme == "dark" ? "#fff" : "#000",
               }); refetch();
          },
     })

     const handleDelete = () => {
          Swal.fire({
               title: t("Are you sure?"),
               text: t("Are you sure you want to delete this item?"),
               icon: "warning",
               showCancelButton: true,
               confirmButtonColor: "#d33",
               cancelButtonColor: "#3085d6",
               confirmButtonText: t("Yes, delete it!"),
               cancelButtonText: t("No, cancel!"),
               background: theme == "dark" ? "#1A1A1A" : "#fff",
               color: theme == "dark" ? "#fff" : "#000",
          }).then((result) => {
               if (result.isConfirmed) {
                    mutate({});
               }
          });
     };

     return (
          <DropdownItem
               className="flex items-center gap-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
               onClick={handleDelete}
          >
               <BiTrash />
               {t("Delete")}
          </DropdownItem>
     );
};

export default DeleteMain;
