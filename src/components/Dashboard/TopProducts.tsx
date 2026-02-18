import { useTranslation } from "react-i18next"

export interface TopProduct {
     id: number
     title_ar: string
     title_en: string
     price: string
     main_image: string | null
     orders_count: number
     total_sold: string | null
     total_revenue: string | null
}

interface TopProductsProps {
     products: TopProduct[]
     loading?: boolean
}

const TopProducts = ({ products, loading }: TopProductsProps) => {
     const { i18n } = useTranslation()
     const isArabic = i18n.language === 'ar'
     const baseURL = import.meta.env.VITE_BASE_URL

     if (loading) {
          return (
               <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                         <div key={i} className="flex gap-4 animate-pulse">
                              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                              <div className="flex-1 space-y-2">
                                   <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                   <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                              </div>
                         </div>
                    ))}
               </div>
          )
     }

     if (!products || products.length === 0) {
          return (
               <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    {isArabic ? 'لا توجد منتجات' : 'No products found'}
               </div>
          )
     }

     return (
          <div className="space-y-4">
               {products.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex gap-4 items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 p-3 rounded-lg transition-colors">
                         {/* Product Image */}
                         <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                              {product.main_image ? (
                                   <img
                                        src={`${baseURL}/${product.main_image}`}
                                        alt={isArabic ? product.title_ar : product.title_en}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                             const target = e.target as HTMLImageElement
                                             target.src = 'https://via.placeholder.com/64?text=No+Image'
                                        }}
                                   />
                              ) : (
                                   <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                   </div>
                              )}
                         </div>

                         {/* Product Info */}
                         <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                   {isArabic ? product.title_ar : product.title_en}
                              </h4>
                              <div className="flex items-center gap-3 mt-1">
                                   <span className="text-xs text-gray-600 dark:text-gray-400">
                                        {isArabic ? 'السعر:' : 'Price:'} {product.price} ر.س
                                   </span>
                                   <span className="text-xs text-gray-600 dark:text-gray-400">
                                        {isArabic ? 'المبيعات:' : 'Sold:'} {product.total_sold || 0}
                                   </span>
                              </div>
                         </div>

                         {/* Revenue */}
                         <div className="text-right">
                              <div className="text-sm font-bold text-green-600 dark:text-green-400">
                                   {product.total_revenue || '0.00'} ر.س
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                   {isArabic ? 'الإيرادات' : 'Revenue'}
                              </div>
                         </div>
                    </div>
               ))}
          </div>
     )
}

export default TopProducts
