import { FiUserCheck, FiUserX } from "react-icons/fi";
import Swal from "sweetalert2";
import { useTheme } from "../../context/ThemeContext";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useTranslation } from "react-i18next";
import { useMutate } from "../../hooks/useMutate";
import { Customer } from "./Types&Validation";

interface ToggleCustomerStatusProps {
     customer: Customer;
     refetch: () => void;
     onClose: () => void;
}

const ToggleCustomerStatus = ({ customer, refetch, onClose }: ToggleCustomerStatusProps) => {
     const { theme } = useTheme();
     const { t } = useTranslation();

     const { mutate } = useMutate({
          endpoint: `mcp/customers/active/${customer.id}`,
          mutationKey: ["toggle-customer-status"],
          method: "put",
          onSuccess: () => {
               refetch();
               onClose();
               Swal.fire({
                    title: t("Success"),
                    text: t("Customer status changed successfully"),
                    icon: "success",
                    background: theme === "dark" ? "#1A1A1A" : "#fff",
                    color: theme === "dark" ? "#fff" : "#000",
               });
          },
          onError: (err: any) => {
               Swal.fire({
                    title: t("Error occurred"),
                    text: err?.response?.data?.message || t("Something went wrong"),
                    icon: "error",
                    background: theme === "dark" ? "#1A1A1A" : "#fff",
                    color: theme === "dark" ? "#fff" : "#000",
               });
          },
     });

     const handleToggle = () => {
          Swal.fire({
               title: t("Are you sure?"),
               text: `${t("Do you want to")} ${customer.is_active ? t("deactivate") : t("activate")} ${t("this customer")}?`,
               icon: "question",
               showCancelButton: true,
               confirmButtonColor: "#3085d6",
               cancelButtonColor: "#d33",
               confirmButtonText: t("Yes"),
               cancelButtonText: t("Cancel"),
               background: theme === "dark" ? "#1A1A1A" : "#fff",
               color: theme === "dark" ? "#fff" : "#000",
          }).then((result) => {
               if (result.isConfirmed) {
                    mutate({});
               }
          });
     };

     return (
          <DropdownItem
               onClick={handleToggle}
               className={`flex items-center gap-2 ${customer.is_active
                    ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    : "text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                    }`}
          >
               {customer.is_active ? <FiUserX /> : <FiUserCheck />}
               {customer.is_active ? t("Deactivate") : t("Activate")}
          </DropdownItem>
     );
};

export default ToggleCustomerStatus;
