import { ReactNode } from "react"

interface Activity {
     id: number
     icon: ReactNode
     iconBg: string
     title: string
     description: string
     time: string
}

interface RecentActivityProps {
     activities: Activity[]
}

const RecentActivity = ({ activities }: RecentActivityProps) => {
     console.log("🚀 ~ RecentActivity ~ activities:", activities)
     return (
          <div className="space-y-4">
               {activities.map((activity, index) => (
                    <div key={activity.id} className="flex gap-4 relative">
                         {/* Timeline line */}
                         {index !== activities.length - 1 && (
                              <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                         )}

                         {/* Icon */}
                         <div className={`${activity.iconBg} p-2.5 rounded-lg h-fit`}>
                              {activity.icon}
                         </div>

                         {/* Content */}
                         <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                   <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                             {activity.title}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                             {activity.description}
                                        </p>
                                   </div>
                                   <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                        {activity.time}
                                   </span>
                              </div>
                         </div>
                    </div>
               ))}
          </div>
     )
}

export default RecentActivity
