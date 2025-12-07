interface BarData {
     label: string
     value: number
     color: string
}

interface SimpleBarChartProps {
     data: BarData[]
     height?: number
}

const SimpleBarChart = ({ data, height = 300 }: SimpleBarChartProps) => {
     const maxValue = Math.max(...data.map(d => d.value))

     return (
          <div className="space-y-4" style={{ height: `${height}px` }}>
               {data.map((item, index) => {
                    const percentage = (item.value / maxValue) * 100

                    return (
                         <div key={index} className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                   <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {item.label}
                                   </span>
                                   <span className="font-semibold text-gray-900 dark:text-white">
                                        {item.value.toLocaleString()}
                                   </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                   <div
                                        className={`h-full ${item.color} rounded-full transition-all duration-500 ease-out`}
                                        style={{ width: `${percentage}%` }}
                                   ></div>
                              </div>
                         </div>
                    )
               })}
          </div>
     )
}

export default SimpleBarChart
