import { ColumnDef } from "@tanstack/react-table";
import useFetch from "../../hooks/useFetch";
import GenerateColumns from "./GenerateColumns";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import IndexTable from "../ui/IndexTable";
import { User, UsersResponse } from "./Types&Validation";

const UsersMain = () => {
     // ================= Translation =================
     const { t } = useTranslation()

     // ================= State =================
     const [page, setPage] = useState(1)
     const [term, setTerm] = useState("")

     // ================= Functions =================
     const queryParams = {
          page: page,
          term: term,
     };
     const searchParams = new URLSearchParams(queryParams as any);
     const endpoint = `mcp/users?${searchParams.toString()}`;
     const { data, refetch, isLoading } = useFetch<UsersResponse>({
          endpoint: endpoint,
          queryKey: [endpoint],
     })
     // @ts-ignore
     const usersData: User[] = data?.result?.data || [];
     const columns: ColumnDef<User>[] = GenerateColumns({ refetch });

     return (
          <div className="relative">
               <IndexTable
                    data={usersData}
                    columns={columns}
                    isLoading={isLoading}
                    addButton={false}
                    title={t("Users")}
                    page={page}
                    setPage={setPage}
                    // @ts-ignore
                    totalPages={data?.result?.meta?.last_page}
                    term={term}
                    setTerm={setTerm}
               />
          </div>
     )
}

export default UsersMain;