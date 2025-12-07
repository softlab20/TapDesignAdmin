import { useField } from "formik";
import { useState, useRef } from "react";
import Label from "../Label";
import { notify } from "../../../../utils/toast";
import axios from "axios";
import Cookies from "js-cookie";
import { t } from "i18next";

interface ImageUploadFieldProps {
     name: string;
     label?: string;
     required?: boolean;
     currentImage?: string;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
     name,
     label,
     required = false,
     currentImage,
}) => {
     const [, meta, helpers] = useField(name);
     // Add cache buster to current image
     const imageWithCacheBuster = currentImage 
          ? `${currentImage}${currentImage.includes('?') ? '&' : '?'}t=${new Date().getTime()}`
          : null;
     const [preview, setPreview] = useState<string | null>(imageWithCacheBuster);
     const [uploading, setUploading] = useState(false);
     const fileInputRef = useRef<HTMLInputElement>(null);
       const user_token = Cookies.get("token");

     const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0];
          if (!file) return;

          // Validate file type
          if (!file.type.startsWith("image/")) {
               notify("error", "Please select a valid image file");
               return;
          }

          // Validate file size (5MB)
          if (file.size > 5 * 1024 * 1024) {
               notify("error", "File size should not exceed 5MB");
               return;
          }

          // Show preview
          const reader = new FileReader();
          reader.onloadend = () => {
               setPreview(reader.result as string);
          };
          reader.readAsDataURL(file);

          // Upload file
          setUploading(true);
          try {
               const formData = new FormData();
               formData.append('file', file);

               const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/mcp/upload`, formData, {
                    headers: {
                         'Content-Type': 'multipart/form-data',
                         'Authorization': `Bearer ${user_token}`,
                    },
               });

               if (data.status === 'success') {
                    const { path }: { path: string; full_path: string } = data.result?.data;
                    helpers.setValue(path);
                    // notify("success", "Image uploaded successfully");
               } else {
                    notify("error", data.message || t("Failed to upload image"));
                    setPreview(null);
               }
          } catch (error: any) {
               notify("error", error?.response?.data?.message || t("Error uploading image"));
               setPreview(null);
          } finally {
               setUploading(false);
          }
     };

     const handleRemove = () => {
          helpers.setValue("");
          setPreview(null);
          if (fileInputRef.current) {
               fileInputRef.current.value = "";
          }
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
                    {preview ? (
                         <div className="relative group">
                              <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                                   <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-full h-64 object-contain p-2"
                                   />
                                   {/* Overlay on hover */}
                                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <button
                                             type="button"
                                             onClick={handleRemove}
                                             className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 font-medium shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                                             disabled={uploading}
                                        >
                                             <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  className="h-5 w-5"
                                                  viewBox="0 0 20 20"
                                                  fill="currentColor"
                                             >
                                                  <path
                                                       fillRule="evenodd"
                                                       d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                       clipRule="evenodd"
                                                  />
                                             </svg>
                                             Remove Image
                                        </button>
                                   </div>
                              </div>
                              
                              {/* Loading Overlay */}
                              {uploading && (
                                   <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center rounded-xl">
                                        <div className="flex flex-col items-center gap-3">
                                             <div className="relative">
                                                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700"></div>
                                                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
                                             </div>
                                             <div className="text-gray-700 dark:text-gray-300 font-medium">Uploading...</div>
                                             <div className="text-sm text-gray-500 dark:text-gray-400">Please wait</div>
                                        </div>
                                   </div>
                              )}
                         </div>
                    ) : (
                         <div
                              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                                   hasError
                                        ? "border-red-400 bg-red-50 dark:bg-red-900/10 hover:border-red-500"
                                        : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                              }`}
                              onClick={() => fileInputRef.current?.click()}
                         >
                              <div className="flex flex-col items-center gap-4">
                                   {/* Icon */}
                                   <div className="relative">
                                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                                             <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  className="h-12 w-12 text-white"
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  stroke="currentColor"
                                             >
                                                  <path
                                                       strokeLinecap="round"
                                                       strokeLinejoin="round"
                                                       strokeWidth={2}
                                                       d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                  />
                                             </svg>
                                        </div>
                                        {/* Pulse animation */}
                                        <div className="absolute inset-0 bg-blue-500/30 rounded-2xl animate-ping"></div>
                                   </div>
                                   
                                   {/* Text */}
                                   <div>
                                        <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                             {t("Click to upload or drag and drop")}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                             {t("PNG, JPG, WEBP up to 5MB")}
                                        </p>
                                   </div>
                                   
                                   {/* Upload button */}
                                   <button
                                        type="button"
                                        className="mt-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                   >
                                        {t("Choose File")}
                                   </button>
                              </div>
                         </div>
                    )}

                    <input
                         ref={fileInputRef}
                         type="file"
                         accept="image/*"
                         onChange={handleFileChange}
                         className="hidden"
                         disabled={uploading}
                    />
               </div>

               {hasError && (
                    <p className="mt-1 text-sm text-error-500">{meta.error}</p>
               )}
          </div>
     );
};

export default ImageUploadField;
