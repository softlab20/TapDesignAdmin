import { ColumnDef } from "@tanstack/react-table"
import useFetch from "../../hooks/useFetch"
import GenerateColumns from "./GenerateColumns"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import IndexTable from "../ui/IndexTable"
import { Modal } from "../ui/modal"

const ContactUsMain = () => {
     // ================= Translation =================
     const { t } = useTranslation()

     // ================= State =================
     const [page, setPage] = useState(1)
     const [term, setTerm] = useState("")
     const [isOpen, setModalOpen] = useState(false)
     const [row, setRow] = useState<any>({})

     // ================= Functions =================
     const queryParams = {
          page: page,
          term: term,
     };
     const searchParams = new URLSearchParams(queryParams as any);
     const endpoint = `mcp/contacts?${searchParams.toString()}`;
     const { data, refetch, isLoading } = useFetch<any>({
          endpoint: endpoint,
          queryKey: [endpoint],
     })
     // @ts-ignore
     const ContactsData = data?.result?.data || []
     const columns: ColumnDef<any>[] = GenerateColumns({ refetch, setModalOpen, setRow });

     return (
          <div className="relative">
               <IndexTable
                    data={ContactsData}
                    columns={columns}
                    isLoading={isLoading}
                    title={t("Contact Us")}
                    page={page}
                    setPage={setPage}
                    // @ts-ignore
                    totalPages={data?.result?.meta?.last_page}
                    term={term}
                    setTerm={setTerm}
               />
               <Modal isOpen={isOpen} onClose={() => setModalOpen(false)} className="max-w-[640px] m-4">
                    <div className="p-6">
                         <h2 className="text-lg font-semibold mb-4">{t("Message Details")}</h2>
                         <div className="space-y-2 text-sm">
                              <div><span className="font-medium">{t("Name")}:</span> {row?.first_name} {row?.last_name}</div>
                              <div><span className="font-medium">{t("Email")}:</span> {row?.email}</div>
                              <div className="mt-3">
                                   <span className="font-medium">{t("Message")}:</span>
                                   <p className="mt-1 whitespace-pre-wrap break-words">{row?.message}</p>
                              </div>
                         </div>
                    </div>
               </Modal>
          </div>
     )
}

export default ContactUsMain;