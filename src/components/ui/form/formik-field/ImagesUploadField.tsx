import { useField } from "formik";
import { useRef, useState } from "react";
import Label from "../Label";
import axios from "axios";
import Cookies from "js-cookie";
import { notify } from "../../../../utils/toast";
import { t } from "i18next";

interface ImagesUploadFieldProps {
     name: string;
     label?: string;
     required?: boolean;
     currentImages?: string[]; // absolute URLs for preview
}

const ImagesUploadField: React.FC<ImagesUploadFieldProps> = ({
     name,
     label,
     required = false,
     currentImages = [],
}) => {
     const [field, meta, helpers] = useField<string[]>(name);
     const [previews, setPreviews] = useState<string[]>(currentImages);
     const [uploading, setUploading] = useState(false);
     const fileInputRef = useRef<HTMLInputElement>(null);
     const token = Cookies.get("token");

     const handleFiles = async (files: FileList) => {
          const validFiles: File[] = [];
          for (const file of Array.from(files)) {
               if (!file.type.startsWith("image/")) {
                    notify("error", t("Please select a valid image file"));
                    continue;
               }
               if (file.size > 5 * 1024 * 1024) {
                    notify("error", t("File size should not exceed 5MB"));
                    continue;
               }
               validFiles.push(file);
          }
          if (validFiles.length === 0) return;

          setUploading(true);
          const newPaths: string[] = [];
          const newPreviews: string[] = [];
          try {
               for (const file of validFiles) {
                    // preview
                    const reader = new FileReader();
                    const previewPromise = new Promise<string>((resolve) => {
                         reader.onloadend = () => resolve(reader.result as string);
                    });
                    reader.readAsDataURL(file);

                    const formData = new FormData();
                    formData.append("file", file);
                    const { data } = await axios.post(
                         `${import.meta.env.VITE_BASE_URL}/mcp/upload`,
                         formData,
                         {
                              headers: {
                                   "Content-Type": "multipart/form-data",
                                   Authorization: `Bearer ${token}`,
                              },
                         }
                    );

                    if (data.status === "success") {
                         const { path } = data.result?.data as { path: string };
                         newPaths.push(path);
                         newPreviews.push(await previewPromise);
                    } else {
                         notify("error", data.message || t("Failed to upload image"));
                    }
               }
               if (newPaths.length) {
                    helpers.setValue([...(field.value || []), ...newPaths]);
                    setPreviews([...(previews || []), ...newPreviews]);
               }
          } catch (error: any) {
               notify("error", error?.response?.data?.message || t("Error uploading image"));
          } finally {
               setUploading(false);
               if (fileInputRef.current) fileInputRef.current.value = "";
          }
     };

     const removeAt = (index: number) => {
          const newVals = [...(field.value || [])];
          const newPrev = [...(previews || [])];
          newVals.splice(index, 1);
          newPrev.splice(index, 1);
          helpers.setValue(newVals);
          setPreviews(newPrev);
     };

     const hasError = meta.touched && meta.error;

     return (
          <div className="relative">
               {label && (
                    <Label htmlFor={name}>
                         {required && <span className="text-error-500 mx-1">*</span>}
                         {label}
                    </Label>
               )}
               <div className="mt-2">
                    <div
                         className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 hover:scale-[1.01] ${hasError
                                   ? "border-red-400 bg-red-50 dark:bg-red-900/10 hover:border-red-500"
                                   : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                              }`}
                         onClick={() => fileInputRef.current?.click()}
                    >
                         <p className="text-sm text-gray-600 dark:text-gray-300">{t("Click to upload multiple images")}</p>
                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t("PNG, JPG, WEBP up to 5MB each")}</p>
                    </div>
                    <input
                         ref={fileInputRef}
                         type="file"
                         accept="image/*"
                         multiple
                         onChange={(e) => e.target.files && handleFiles(e.target.files)}
                         className="hidden"
                         disabled={uploading}
                    />
               </div>
               {previews && previews.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                         {previews.map((src, idx) => (
                              <div key={idx} className="relative group">
                                   <img src={src} className="w-full h-28 object-cover rounded-lg border" />
                                   <button
                                        type="button"
                                        onClick={() => removeAt(idx)}
                                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100"
                                        disabled={uploading}
                                   >
                                        {t("Remove")}
                                   </button>
                              </div>
                         ))}
                    </div>
               )}
               {uploading && (
                    <div className="mt-2 text-sm text-gray-500">{t("Uploading...")}</div>
               )}
               {hasError && (
                    <p className="mt-1 text-sm text-error-500">{meta.error as any}</p>
               )}
          </div>
     );
};

export default ImagesUploadField;
