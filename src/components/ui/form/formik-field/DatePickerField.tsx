import { useField } from "formik"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "./DatePickerCustom.css"
import { useTranslation } from "react-i18next"
import { Calendar } from "lucide-react"

interface DatePickerFieldProps {
     name: string
     label?: string
     placeholder?: string
     required?: boolean
     disabled?: boolean
     className?: string
     onChange?: (date: Date | null) => void
}

export function DatePickerField({
     name,
     label,
     placeholder,
     required = false,
     disabled = false,
     className,
     onChange,
}: DatePickerFieldProps) {
     const { t } = useTranslation()
     const [field, meta, helpers] = useField(name)

     const selectedDate = field.value ? new Date(field.value) : null

     const handleChange = (date: Date | null) => {
          if (date) {
               // Format date without timezone conversion
               const year = date.getFullYear()
               const month = String(date.getMonth() + 1).padStart(2, '0')
               const day = String(date.getDate()).padStart(2, '0')
               const formattedDate = `${year}-${month}-${day}`
               helpers.setValue(formattedDate)
          } else {
               helpers.setValue("")
          }
          
          // Call external onChange if provided
          if (onChange) {
               onChange(date)
          }
     }

     const hasError = meta.touched && meta.error

     return (
          <div className={`flex flex-col gap-2 ${className}`}>
               {label && (
                    <label
                         htmlFor={name}
                         className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                         {label}
                         {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
               )}

               <div className="relative">
                    <DatePicker
                         selected={selectedDate}
                         onChange={handleChange}
                         disabled={disabled}
                         placeholderText={placeholder || t("Pick a date")}
                         dateFormat="yyyy-MM-dd"
                         className={`
                              w-full px-4 py-3 pl-12 text-left font-medium
                              border-2 border-gray-300 rounded-xl bg-white shadow-sm
                              hover:border-blue-400 hover:shadow-md 
                              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                              transition-all duration-200
                              dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:hover:border-blue-500
                              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300
                              placeholder:text-gray-400 dark:placeholder:text-gray-500
                              ${hasError ? 'border-red-500 focus:ring-red-500 hover:border-red-600 dark:border-red-500' : ''}
                         `}
                         wrapperClassName="w-full"
                         calendarClassName="!font-sans"
                         popperClassName="date-picker-popper"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                         <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 rounded-lg">
                              <Calendar className="h-4 w-4 text-white" />
                         </div>
                    </div>
               </div>

               {hasError && (
                    <p className="text-sm text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                         <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                         </svg>
                         {meta.error}
                    </p>
               )}
          </div>
     )
}
