import { Formik, Form } from "formik"
import { useTranslation } from "react-i18next"
import BaseInputField from "../ui/form/formik-field/BaseInputField"
import { useMutate } from "../../hooks/useMutate"
import Button from "../ui/button/Button"
import { CouponFormValues, Coupon } from "./Types&Validation"
import { MainDataValidation } from "./Types&Validation"
import SelectField from "../ui/form/formik-field/SelectField"
import { DatePickerField } from "../ui/form/formik-field/DatePickerField"

type MainDataProps = {
     row: Coupon | any
     refetch: () => void
     setModalOpen: (open: boolean) => void
     setRow: (row: any) => void
}

const MainData = ({ row, refetch, setModalOpen, setRow }: MainDataProps) => {
     const { t } = useTranslation()

     const endpoint = row?.id ? `mcp/coupons/${row.id}` : "mcp/coupons"

     const { mutate, isPending } = useMutate({
          mutationKey: [endpoint],
          endpoint: endpoint,
          onSuccess: () => {
               refetch()
               setModalOpen(false)
               setRow({})
          },
          method: row?.id ? "put" : "post",
     })

     const handleSubmit = (values: CouponFormValues) => {
          const submissionData = new FormData()
          submissionData.append("code", values.code)
          submissionData.append("type", values.type)
          submissionData.append("value", values.value.toString())
          submissionData.append("count", values.count.toString())
          submissionData.append("from_date", values.from_date)
          submissionData.append("to_date", values.to_date)

          mutate(submissionData)
     }

     const typeOptions = [
          { value: "fixed", label: t("Fixed") },
          { value: "percentage", label: t("Percentage") },
     ]

     return (
          <div>
               <h2 className="text-xl font-semibold mb-4 dark:text-white">
                    {row?.id ? t("Edit Coupon") : t("Add New Coupon")}
               </h2>

               <Formik
                    initialValues={{
                         id: row?.id,
                         code: row?.code || "",
                         type: row?.type || "",
                         value: row?.value || null,
                         count: row?.count || null,
                         from_date: row?.from_date || "",
                         to_date: row?.to_date || "",
                    }}
                    validationSchema={MainDataValidation}
                    onSubmit={(values) => handleSubmit(values)}
               >
                    {({ handleSubmit }) => (
                         <Form onSubmit={handleSubmit}>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                                   <BaseInputField
                                        name="code"
                                        type="text"
                                        label={t("Coupon Code")}
                                        required
                                   />

                                   <SelectField
                                        name="type"
                                        label={t("Discount Type")}
                                        options={typeOptions}
                                        placeholder={t("Select Type")}
                                        required
                                   />

                                   <BaseInputField
                                        name="value"
                                        type="number"
                                        label={t("Value")}
                                        required
                                        step={0.01}
                                   />

                                   <BaseInputField
                                        name="count"
                                        type="number"
                                        label={t("Usage Count")}
                                        required
                                   />

                                   <DatePickerField
                                        name="from_date"
                                        label={t("From Date")}
                                        placeholder={t("Select start date")}
                                        required
                                   />

                                   <DatePickerField
                                        name="to_date"
                                        label={t("To Date")}
                                        placeholder={t("Select end date")}
                                        required
                                   />
                              </div>

                              <div className="flex gap-2 mt-6">
                                   <Button
                                        className="mt-4"
                                        variant="primary"
                                        loading={isPending}
                                        disabled={isPending}
                                   >
                                        {row.id ? t("Update") : t("Create")}
                                   </Button>
                                   <Button
                                        className="mt-4"
                                        variant="outline"
                                        onClick={() => {
                                             setModalOpen(false)
                                             setRow({})
                                        }}
                                        disabled={isPending}
                                   >
                                        {t("Cancel")}
                                   </Button>
                              </div>
                         </Form>
                    )}
               </Formik>
          </div>
     )
}

export default MainData
