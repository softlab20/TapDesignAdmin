import { useField } from "formik";
import React from "react";

interface SwitchProps {
     name: string; // Required for Formik
     label: string;
     disabled?: boolean;
     color?: "blue" | "gray"; // Added prop to toggle color theme
     onChange?: (checked: boolean) => void; // Changed to accept boolean
}

const SwitchField: React.FC<SwitchProps> = ({
     name,
     label,
     disabled = false,
     color = "blue",
     onChange,
}) => {
     const [field, , helpers] = useField({ name, type: "checkbox" });

     const handleToggle = () => {
          if (disabled) return;
          const newCheckedState = !field.value;
          helpers.setValue(newCheckedState);
          if (onChange) {
               onChange(newCheckedState);
          }
     };

     const switchColors =
          color === "blue"
               ? {
                    background: field.value
                         ? "bg-brand-500"
                         : "bg-gray-200 dark:bg-white/10",
                    knob: field.value
                         ? "translate-x-full bg-white"
                         : "translate-x-0 bg-white",
               }
               : {
                    background: field.value
                         ? "bg-gray-800 dark:bg-white/10"
                         : "bg-gray-200 dark:bg-white/10",
                    knob: field.value
                         ? "translate-x-full bg-white"
                         : "translate-x-0 bg-white",
               };

     return (
          <label
               className={`flex cursor-pointer select-none items-center gap-3 text-sm font-medium ${disabled ? "text-gray-400" : "text-gray-700 dark:text-gray-400"
                    }`}
               onClick={(e) => {
                    e.preventDefault(); // Prevent double triggering
                    handleToggle();
               }}
          >
               <div className="relative">
                    <div
                         className={`block transition duration-150 ease-linear h-6 w-11 rounded-full ${disabled
                                   ? "bg-gray-100 pointer-events-none dark:bg-gray-800"
                                   : switchColors.background
                              }`}
                    ></div>
                    <div
                         className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow-theme-sm duration-150 ease-linear transform ${switchColors.knob}`}
                    ></div>
               </div>
               {label}
          </label>
     );
};

export default SwitchField;