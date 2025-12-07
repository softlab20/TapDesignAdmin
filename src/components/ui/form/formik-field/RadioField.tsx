import { useField } from "formik";

// واجهة Props لـ RadioField مع Formik
interface RadioFieldProps {
     id: string; // معرف فريد للـ radio
     name: string; // اسم المجموعة (يستخدمه Formik لربط الحقل)
     value: string; // قيمة الـ radio
     label: string; // نص التسمية
     className?: string; // كلاسات إضافية اختيارية
     disabled?: boolean; // حالة التعطيل اختيارية
}

/**
 * مكون RadioField متوافق مع Formik لعرض زر اختيار دائري
 */
const RadioField: React.FC<RadioFieldProps> = ({
     id,
     name,
     value,
     label,
     className = "",
     disabled = false,
}) => {
     const [field, meta] = useField(name);

     // التحقق مما إذا كانت القيمة المختارة في Formik تتطابق مع قيمة هذا الـ radio
     const isChecked = field.value === value;

     const handleChange = () => {
          if (!disabled) {
               field.onChange({ target: { name, value } }); // تحديث قيمة Formik
          }
     };

     return (
          <div className="relative">
               <label
                    htmlFor={id}
                    className={`relative flex cursor-pointer select-none items-center gap-3 text-sm font-medium ${disabled
                              ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                              : "text-gray-700 dark:text-gray-400"
                         } ${className}`}
               >
                    <input
                         id={id}
                         name={name}
                         type="radio"
                         value={value}
                         checked={isChecked}
                         onChange={handleChange}
                         className="sr-only" // إخفاء الـ input الأصلي
                         disabled={disabled}
                    />
                    <span
                         className={`flex h-5 w-5 items-center justify-center rounded-full border-[1.25px] ${isChecked
                                   ? "border-brand-500 bg-brand-500"
                                   : "bg-transparent border-gray-300 dark:border-gray-700"
                              } ${disabled
                                   ? "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-700"
                                   : ""
                              }`}
                    >
                         <span
                              className={`h-2 w-2 rounded-full bg-white ${isChecked ? "block" : "hidden"
                                   }`}
                         ></span>
                    </span>
                    {label}
               </label>

               {/* عرض رسالة الخطأ إذا وجدت */}
               {meta.touched && meta.error ? (
                    <div className="mt-1 text-sm text-red-500">{meta.error}</div>
               ) : null}
          </div>
     );
};

export default RadioField;