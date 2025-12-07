import { useField } from "formik";
import TextArea from "../input/TextArea";
import ComponentCard from "../../ComponentCard";

// Define props interface
interface TextAreaFieldProps {
     name: string;
     label?: string;
     id?: string;
     disabled?: boolean;
     rows?: number;
     [key: string]: any; // For additional props
}

export default function TextAreaField({
     name,
     label,
     id,
     disabled = false,
     rows = 6,
     ...props
}: TextAreaFieldProps) {
     // Type the useField return value
     const [field, meta] = useField<string>(name);

     // Determine if there's an error
     const hasError: boolean = meta.touched && !!meta.error;

     return (
          <ComponentCard title={label as string}>
               <div className="space-y-6">
                    <div>
                         <TextArea
                              {...field}           // Spread Formik field props
                              {...props}          // Spread additional props
                              rows={rows}         // Number of rows
                              disabled={disabled} // Disabled state
                              error={hasError}    // Error state
                              hint={hasError ? meta.error : undefined} // Error message as hint
                              onChange={(value: string) =>
                                   field.onChange({ target: { name, value } })
                              } // Update Formik state with typed value
                         />
                    </div>
               </div>
          </ComponentCard>
     );
}