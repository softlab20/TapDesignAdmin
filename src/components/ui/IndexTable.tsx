import { useState } from "react";
import {
     ColumnDef,
     useReactTable,
     getCoreRowModel,
     getSortedRowModel,
     getFilteredRowModel,
     SortingState,
     flexRender,
} from "@tanstack/react-table";
import { useNavigate } from "react-router";
import Spinner from "./spinner/Spinner";
import ReactPaginate from "react-paginate";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./table/index";
import { FaRegFolderOpen } from "react-icons/fa";
import Button from "./button/Button";
import { useTranslation } from "react-i18next"
import PageBreadcrumb from "./PageBreadCrumb";
import { FiPlus } from "react-icons/fi";

interface IndexTableProps<TData, TValue> {
     columns: ColumnDef<TData, TValue>[];
     data: TData[];
     setTerm?: (term: string) => void;
     term?: string;
     isLoading: boolean;
     addButton?: boolean;
     addButtonLabel?: string;
     setAddModalOpen?: (open: boolean) => void;
     title?: string;
     totalPages?: number;
     page?: number;
     setPage?: (page: number) => void;
     addRoute?: string;
}

const IndexTable = <TData, TValue>({
     columns,
     data,
     setTerm,
     term = "",
     isLoading,
     addButton = false,
     addButtonLabel = "Add",
     addRoute,
     setAddModalOpen,
     title,
     totalPages,
     page,
     setPage,
}: IndexTableProps<TData, TValue>) => {
     const [sorting, setSorting] = useState<SortingState>([]);
     const navigate = useNavigate();
     const { t } = useTranslation()

     const table = useReactTable({
          data,
          columns,
          state: { sorting, globalFilter: term },
          onSortingChange: setSorting,
          getCoreRowModel: getCoreRowModel(),
          getFilteredRowModel: getFilteredRowModel(),
          getSortedRowModel: getSortedRowModel(),
          globalFilterFn: "includesString",
          manualPagination: true,
          pageCount: totalPages,
     });

     const handlePageClick = (event: { selected: number }) => {
          if (setPage) {
               setPage(event.selected + 1);
          }
     };

     return (
          <div className="w-full">
               {title && (
                    <PageBreadcrumb pageTitle={title} />
               )}

               <div className={`flex ${setTerm ? "justify-between" : "justify-end"} items-center mb-4`}>
                    {setTerm && (
                         <div className="relative">
                              <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                                   <svg
                                        className="fill-gray-500 dark:fill-gray-400"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                   >
                                        <path
                                             fillRule="evenodd"
                                             clipRule="evenodd"
                                             d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                                             fill=""
                                        />
                                   </svg>
                              </span>
                              <input
                                   type="text"
                                   placeholder={t("Search...")}
                                   className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]"
                                   value={term}
                                   onChange={(e) => setTerm(e.target.value)}
                              />
                         </div>
                    )}
                    {addButton && (
                         <Button
                              onClick={
                                   setAddModalOpen
                                        ? () => setAddModalOpen(true)
                                        : () => addRoute && navigate(addRoute)
                              }
                         >
                              <FiPlus className="h-5 w-5" />
                              {t(`${addButtonLabel}`)}
                         </Button>
                    )}
               </div>

               <div className="overflow-hidden rounded-xl bg-white dark:border-white/[0.05] dark:bg-white/[0.03] min-h-[100px]">
                    <div className="max-w-full overflow-x-auto">
                         <Table>
                              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                   {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                             {headerGroup.headers.map((header) => (
                                                  <TableCell
                                                       key={header.id}
                                                       isHeader
                                                       className="px-5 py-3 font-medium text-gray-500 text-start text-md dark:text-gray-400 cursor-pointer select-none"
                                                       // @ts-ignore
                                                       onClick={header.column.getToggleSortingHandler()}
                                                  >
                                                       <div className="flex items-center">
                                                            {flexRender(
                                                                 header.column.columnDef.header,
                                                                 header.getContext()
                                                            )}
                                                       </div>
                                                  </TableCell>
                                             ))}
                                        </TableRow>
                                   ))}
                              </TableHeader>

                              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                   {!isLoading && table.getRowModel().rows.length > 0 ? (
                                        table.getRowModel().rows.map((row) => (
                                             <TableRow
                                                  key={row.id}
                                                  className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors duration-200"
                                             >
                                                  {row.getVisibleCells().map((cell) => (
                                                       <TableCell
                                                            key={cell.id}
                                                            className="px-5 py-4 text-gray-500 text-start text-md dark:text-gray-400"
                                                       >
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                       </TableCell>
                                                  ))}
                                             </TableRow>
                                        ))
                                   ) : null}
                              </TableBody>
                         </Table>
                    </div>
                    {isLoading && (
                         <div className="inset-0 mt-2 flex items-center justify-center z-10">
                              <Spinner size="xxl" />
                         </div>
                    )}

                    {!isLoading && table.getRowModel().rows.length === 0 && (
                         <div className="inset-0 flex flex-col items-center justify-center z-10">
                              <FaRegFolderOpen size={50} className="mb-4 text-gray-500 dark:text-gray-400" />
                              <p className="text-gray-500 dark:text-gray-400">{t("No data found...")}</p>
                         </div>
                    )}
               </div>

               {totalPages && page && setPage && table.getRowModel().rows.length > 0 && (
                    <div className="flex justify-start mt-4">
                         <ReactPaginate
                              breakLabel="..."
                              onPageChange={handlePageClick}
                              pageRangeDisplayed={5}
                              pageCount={totalPages}
                              renderOnZeroPageCount={null}
                              containerClassName="flex gap-2 items-center"
                              pageClassName="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                              activeClassName="bg-primary text-white"
                              previousClassName="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                              nextClassName="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                              disabledClassName="opacity-50 cursor-not-allowed"
                              forcePage={page - 1}
                              nextLabel={t("Next")}
                              previousLabel={t("Previous")}
                         />
                    </div>
               )}
          </div>
     );
};

export default IndexTable;