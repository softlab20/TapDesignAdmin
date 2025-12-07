import { ColumnDef } from "@tanstack/react-table"
import useFetch from "../../hooks/useFetch"
import GenerateColumns from "./GenerateColumns"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import IndexTable from "../ui/IndexTable"
import CustomerDetailsModal from "./CustomerDetailsModal"
import { Customer } from "./Types&Validation"

const CustomersMain = () => {
     // ================= Translation =================
     const { t } = useTranslation()

     // ================= State =================
     const [page, setPage] = useState(1)
     const [term, setTerm] = useState("")
     const [row, setRow] = useState<Customer | null>(null)
     const [isOpen, setModalOpen] = useState(false)

     // ================= Functions =================
     const queryParams = {
          page: page,
          term: term,
     };
     const searchParams = new URLSearchParams(queryParams as any);
     const endpoint = `mcp/customers?${searchParams.toString()}`;
     const { data, refetch, isLoading } = useFetch<any>({
          endpoint: endpoint,
          queryKey: [endpoint],
     })
     const closeModal = () => {
          setModalOpen(false)
          setRow(null)
     }
     // @ts-ignore
     const CustomersData = data?.result?.data || []
     const columns: ColumnDef<Customer>[] = GenerateColumns({ refetch, setRow, setModalOpen });

     return (
          <div className="relative">
               <IndexTable
                    data={CustomersData}
                    columns={columns}
                    isLoading={isLoading}
                    addButton={false}
                    title={t("Customers")}
                    page={page}
                    setPage={setPage}
                    // @ts-ignore
                    totalPages={data?.result?.meta?.last_page}
                    term={term}
                    setTerm={setTerm}
                    setAddModalOpen={setModalOpen}
               />
               <CustomerDetailsModal
                    customer={row}
                    isOpen={isOpen}
                    onClose={closeModal}
               />
          </div>
     )
}

export default CustomersMain;