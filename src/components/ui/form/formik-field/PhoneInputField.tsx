import { useField } from "formik";
import Label from "../Label";

// تعريف واجهة CountryCode
interface CountryCode {
     code: string;
     label: string;
}

interface PhoneInputFieldProps {
     label?: string;
     required?: boolean;
     id?: string;
     name: string;
     countries?: CountryCode[]; // جعل countries اختياري
     placeholder?: string;
     className?: string;
}

/**
 * مكون PhoneInputField متوافق مع Formik مع تثبيت السعودية كقيمة افتراضية
 */
const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
     label,
     required,
     id,
     name,
     countries,
     placeholder = "+966 (555) 000-0000",
     className = "",
}) => {
     const [field, meta] = useField(name);

     // إذا لم يتم تمرير countries، استخدم السعودية كقيمة افتراضية
     const saudiCode = countries?.find((country) => country.code === "SA")?.label || "+966";

     const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          field.onChange({ target: { name, value } });
     };

     return (
          <div className="relative flex flex-col"> {/* تغيير إلى flex-col لضمان عرض الـ label والـ error بشكل صحيح */}
               {label && (
                    <Label htmlFor={id || name}>
                         {required && <span className="text-error-500 mx-1">*</span>}
                         {label}
                    </Label>
               )}

               <div className="relative flex">
                    <div className="absolute inset-y-0 left-0 flex items-center bg-transparent pl-3.5 text-gray-700 dark:text-gray-400">
                         <span className="leading-tight">{saudiCode}</span>
                    </div>

                    <input
                         type="tel"
                         {...field}
                         onChange={handlePhoneNumberChange}
                         placeholder={placeholder}
                         className={`h-11 w-full rounded-lg border border-gray-300 bg-transparent py-3 pl-[60px] pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${meta.touched && meta.error ? "border-red-500" : ""
                              } ${className}`}
                    />

                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700 pointer-events-none dark:text-gray-400">
                         <svg
                              className="stroke-current"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                         >
                              <path
                                   d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                                   stroke="currentColor"
                                   strokeWidth="1.5"
                                   strokeLinecap="round"
                                   strokeLinejoin="round"
                              />
                         </svg>
                    </div>
               </div>

               {meta.touched && meta.error ? (
                    <div className="mt-1 text-sm text-red-500">{meta.error}</div>
               ) : null}
          </div>
     );
};

export default PhoneInputField;