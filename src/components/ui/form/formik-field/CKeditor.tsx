import { ErrorMessage, useFormikContext } from "formik";
import React, { Suspense, lazy, useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import Spinner from "../../spinner/Spinner";
import Label from "../Label";

// Lazy load ReactQuill
const ReactQuill = lazy(() => import("react-quill"));

type Editor_TP = {
  label?: string;
  placeholder?: string;
  description?: string;
  error?: string;
  className?: string;
  type?: string;
  handleChange?: any;
  value?: any;
  name?: any;
  required?: boolean;
};

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { header: "3" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    [{ color: [] }],
    ["clean"],
    [{ direction: "rtl" }, { align: [] }],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "color",
  "direction",
  "align",
];

const CKeditor: React.FC<Editor_TP> = ({
  label,
  required,
  placeholder,
  description,
  error,
  className,
  name,
  type,
  handleChange,
  ...props
}) => {
  const { values, setFieldValue } = useFormikContext<any>();
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(values[name]);
  }, [values, name]);

  const direction = "ltr";

  return (
    <div className={className}>
      {label && (
        <Label>
          {required && <span className="text-error-500 mx-1">*</span>}
          {label}
        </Label>
      )}
      <Suspense fallback={<Spinner />}>
        <div dir={direction} className="my-2">
          <ReactQuill
            // placeholder={placeholder}
            value={value}
            onChange={(value) => {
              setFieldValue(name, value);
              setValue(value);
              if (handleChange) handleChange(value);
            }}
            theme="snow"
            modules={modules}
            formats={formats}
            {...props}
          />
        </div>
      </Suspense>
      {/* {error && <div className="text-red-600">{error}</div>} */}
      {/* {description && <div className="text-gray-600">{description}</div>} */}
      <ErrorMessage name={name}>
        {(msg) => <div className="text-red-600">{msg}</div>}
      </ErrorMessage>
    </div>
  );
};

export default CKeditor;
