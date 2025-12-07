import { ReactNode } from "react"

interface StatCardProps {
     title: string
     value: string | number
     icon: ReactNode
     iconBgColor: string
     iconColor: string
     trend?: {
          value: number
          isPositive: boolean
     }
     loading?: boolean
}

const StatCard = ({ title, value, icon, iconBgColor, iconColor, trend, loading }: StatCardProps) => {
     return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
               <div className="flex items-center justify-between">
                    <div className="flex-1">
                         <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                              {title}
                         </p>
                         {loading ? (
                              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                         ) : (
                              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                   {value}
                              </h3>
                         )}
                         {trend && !loading && (
                              <div className="flex items-center gap-1 mt-2">
                                   <span className={`text-xs font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                                        {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                                   </span>
                                   <span className="text-xs text-gray-500 dark:text-gray-400">vs last month</span>
                              </div>
                         )}
                    </div>
                    <div className={`${iconBgColor} ${iconColor} p-4 rounded-xl`}>
                         {icon}
                    </div>
               </div>
          </div>
     )
}

export default StatCard
