import { useField } from "formik";
import Label from "../Label";
import Select, { StylesConfig } from "react-select";
import { useTheme } from "../../../../context/ThemeContext";

// تعريف واجهة Option
interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    name: string;
    options?: Option[];
    placeholder?: string;
    className?: string;
    defaultValue?: string;
    label?: string;
    id?: string;
    required?: boolean;
    isSearchable?: boolean;
    isClearable?: boolean;
}

/**
 * مكون SelectField متوافق مع Formik لعرض قائمة منسدلة محسّنة باستخدام react-select
 */
const SelectField: React.FC<SelectProps> = ({
    name,
    options = [],
    label,
    id,
    placeholder = "Select an option",
    className = "",
    required = false,
    isSearchable = true,
    isClearable = false,
}) => {
    const [field, meta, helpers] = useField(name);
    const { theme } = useTheme();
    const isDark = theme === "dark";

    // Custom styles for react-select
    const customStyles: StylesConfig<Option, false> = {
        control: (base, state) => ({
            ...base,
            minHeight: "44px",
            borderRadius: "0.5rem",
            borderColor: meta.touched && meta.error 
                ? "#ef4444" 
                : state.isFocused 
                    ? isDark ? "#9333ea" : "#a855f7"
                    : isDark ? "#374151" : "#d1d5db",
            backgroundColor: isDark ? "#111827" : "#ffffff",
            boxShadow: state.isFocused 
                ? isDark 
                    ? "0 0 0 3px rgba(168, 85, 247, 0.1)" 
                    : "0 0 0 3px rgba(168, 85, 247, 0.1)"
                : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            "&:hover": {
                borderColor: isDark ? "#9333ea" : "#a855f7",
            },
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? isDark ? "#9333ea" : "#a855f7"
                : state.isFocused
                    ? isDark ? "#1f2937" : "#f3f4f6"
                    : isDark ? "#111827" : "#ffffff",
            color: state.isSelected
                ? "#ffffff"
                : isDark ? "#f9fafb" : "#111827",
            cursor: "pointer",
            "&:active": {
                backgroundColor: isDark ? "#7e22ce" : "#9333ea",
            },
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: isDark ? "#111827" : "#ffffff",
            borderRadius: "0.5rem",
            border: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
            boxShadow: isDark
                ? "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
                : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
        }),
        menuList: (base) => ({
            ...base,
            padding: "4px",
        }),
        singleValue: (base) => ({
            ...base,
            color: isDark ? "#f9fafb" : "#111827",
        }),
        placeholder: (base) => ({
            ...base,
            color: isDark ? "#6b7280" : "#9ca3af",
        }),
        input: (base) => ({
            ...base,
            color: isDark ? "#f9fafb" : "#111827",
        }),
        dropdownIndicator: (base) => ({
            ...base,
            color: isDark ? "#6b7280" : "#9ca3af",
            "&:hover": {
                color: isDark ? "#9ca3af" : "#6b7280",
            },
        }),
        indicatorSeparator: (base) => ({
            ...base,
            backgroundColor: isDark ? "#374151" : "#d1d5db",
        }),
        clearIndicator: (base) => ({
            ...base,
            color: isDark ? "#6b7280" : "#9ca3af",
            "&:hover": {
                color: isDark ? "#ef4444" : "#dc2626",
            },
        }),
        loadingIndicator: (base) => ({
            ...base,
            color: isDark ? "#9333ea" : "#a855f7",
        }),
    };

    // Find the selected option
    const selectedOption = options.find(option => option.value === field.value) || null;

    return (
        <div className={`relative ${className}`}>
            {label && (
                <Label htmlFor={id || name}>
                    {required && <span className="text-error-500 mx-1">*</span>}
                    {label}
                </Label>
            )}

            <Select
                id={id || name}
                name={name}
                options={options}
                value={selectedOption}
                onChange={(option) => helpers.setValue(option?.value || "")}
                onBlur={() => helpers.setTouched(true)}
                placeholder={options.length ? placeholder : "Loading options..."}
                isDisabled={!options.length}
                isSearchable={isSearchable}
                isClearable={isClearable}
                styles={customStyles}
                className="react-select-container"
                classNamePrefix="react-select"
                noOptionsMessage={() => "No options available"}
                loadingMessage={() => "Loading..."}
            />

            {meta.touched && meta.error ? (
                <div className="mt-1 text-sm text-red-500">{meta.error}</div>
            ) : null}
        </div>
    );
};

export default SelectField;