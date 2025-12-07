import { OrderItem } from "./Types&Validation";

interface PersonalizedProductPreviewProps {
     item: OrderItem;
     size?: 'small' | 'medium' | 'large';
}

const PersonalizedProductPreview = ({ item, size = 'medium' }: PersonalizedProductPreviewProps) => {
     const appURL = import.meta.env.VITE_URL;

     if (!item.is_personalized || !item.selected_color) {
          // Display regular product image
          const imageSource = item?.product_image || item?.product?.main_image;

          return (
               <div className={`relative ${size === 'small' ? 'w-16 h-16' : size === 'medium' ? 'w-24 h-24' : 'w-32 h-32'} rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700`}>
                    {imageSource ? (
                         <img
                              src={`${appURL}/${imageSource}`}
                              alt={item.product_title_en}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                   const target = e.target as HTMLImageElement;
                                   target.src = 'https://via.placeholder.com/100?text=No+Image';
                              }}
                         />
                    ) : (
                         <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                         </div>
                    )}
               </div>
          );
     }

     const { selected_color, personalization_details } = item;
     const emoji = personalization_details?.emoji;
     const text = personalization_details?.text;
     const numbers = personalization_details?.numbers;

     // Construct the personalized product image path
     const personalizedImagePath = `/images/personalized/${selected_color}.png`;

     // Construct the emoji icon path
     const emojiIconPath = emoji ? `/images/personalized/icons/${emoji}.png` : null;

     const containerSize = size === 'small' ? 'w-16 h-16' : size === 'medium' ? 'w-24 h-24' : 'w-32 h-32';


     return (
          <div className={`relative ${containerSize} rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700`}>
               {/* Base Product Image (with color) */}
               <img
                    src={personalizedImagePath}
                    alt={`${item.product_title_en} - ${selected_color}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                         const target = e.target as HTMLImageElement;
                         target.src = item.product_image
                              ? `${appURL}/${item.product_image}`
                              : 'https://via.placeholder.com/100?text=No+Image';
                    }}
               />

               {/* Personalization Overlay */}
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {/* Emoji Icon */}
                    {emojiIconPath && (
                         <img
                              src={emojiIconPath}
                              alt={emoji}
                              className="object-contain mb-0.5 h-2 w-2"
                              onError={(e) => {
                                   const target = e.target as HTMLImageElement;
                                   target.style.display = 'none';
                              }}
                         />
                    )}

                    {/* Text */}
                    {text && (
                         <div className={`text-[5px] font-bold text-white text-center drop-shadow-md px-1`}>
                              {text}
                         </div>
                    )}

                    {/* Numbers */}
                    {numbers && (
                         <div className={`text-[5px] font-bold text-white text-center drop-shadow-md px-1`}>
                              {numbers}
                         </div>
                    )}
               </div>

               {/* Personalization Badge */}
               <div className="absolute top-1 right-1">
                    <div className="bg-purple-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-semibold shadow-lg">
                         ★
                    </div>
               </div>
          </div>
     );
};

export default PersonalizedProductPreview;
