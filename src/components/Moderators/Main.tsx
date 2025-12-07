import { ColumnDef } from "@tanstack/react-table"
import useFetch from "../../hooks/useFetch"
import GenerateColumns from "./GenerateColumns"
import { useState } from "react"
import { Modal } from "../ui/modal"
import MainData from "./MainData"
import { t } from "i18next"
import IndexTable from "../ui/IndexTable"

const ModeratorsMain = () => {
     // ================= State =================
     const [page, setPage] = useState(1)
     const [term, setTerm] = useState("")
     const [row, setRow] = useState<any>({})
     const [isOpen, setModalOpen] = useState(false)

     // ================= Functions =================
     const queryParams = {
          page,
          term,
     };
     const searchParams = new URLSearchParams(queryParams as any);
     const endpoint = `mcp/moderators?${searchParams.toString()}`;
     const { data, refetch, isLoading } = useFetch<any>({
          endpoint,
          queryKey: [endpoint],
     })
     const closeModal = () => {
          setModalOpen(false)
          setRow({})
     }
     // @ts-ignore
     const ModeratorsData = data?.result?.data || []
     const columns: ColumnDef<any>[] = GenerateColumns({ refetch, setRow, setModalOpen });

     return (
          <div className="relative">
               <IndexTable
                    data={ModeratorsData}
                    columns={columns}
                    isLoading={isLoading}
                    addButton={true}
                    title={t("Moderators")}
                    addButtonLabel="Add"
                    page={page}
                    setPage={setPage}
                    // @ts-ignore
                    totalPages={data?.result?.meta?.last_page}
                    term={term}
                    setTerm={setTerm}
                    setAddModalOpen={setModalOpen}
               />
               <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[1024px] m-4">
                    <MainData
                         refetch={refetch}
                         row={row}
                         setModalOpen={setModalOpen}
                         setData={setRow}
                    />
               </Modal>
          </div>
     )
}

export default ModeratorsMain