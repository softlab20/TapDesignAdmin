interface LineData {
     label: string
     value: number
}

interface SimpleLineChartProps {
     data: LineData[]
     height?: number
     color?: string
}

const SimpleLineChart = ({ data, height = 200, color = "stroke-blue-500" }: SimpleLineChartProps) => {
     const maxValue = Math.max(...data.map(d => d.value))
     const minValue = Math.min(...data.map(d => d.value))
     const range = maxValue - minValue

     const width = 100
     const chartHeight = height - 40

     const points = data.map((item, index) => {
          const x = (index / (data.length - 1)) * width
          const y = chartHeight - ((item.value - minValue) / range) * chartHeight
          return `${x},${y}`
     }).join(' ')

     const areaPoints = `0,${chartHeight} ${points} ${width},${chartHeight}`

     return (
          <div className="w-full" style={{ height: `${height}px` }}>
               <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-full"
                    preserveAspectRatio="none"
               >
                    <defs>
                         <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" className="text-blue-500" stopColor="currentColor" stopOpacity="0.3" />
                              <stop offset="100%" className="text-blue-500" stopColor="currentColor" stopOpacity="0" />
                         </linearGradient>
                    </defs>

                    {/* Area under the line */}
                    <polygon
                         points={areaPoints}
                         fill="url(#lineGradient)"
                    />

                    {/* Line */}
                    <polyline
                         points={points}
                         fill="none"
                         className={color}
                         strokeWidth="2"
                         strokeLinecap="round"
                         strokeLinejoin="round"
                    />

                    {/* Points */}
                    {data.map((item, index) => {
                         const x = (index / (data.length - 1)) * width
                         const y = chartHeight - ((item.value - minValue) / range) * chartHeight
                         return (
                              <circle
                                   key={index}
                                   cx={x}
                                   cy={y}
                                   r="1.5"
                                   className="fill-blue-500"
                              />
                         )
                    })}
               </svg>

               {/* Labels */}
               <div className="flex justify-between mt-2 px-1">
                    {data.map((item, index) => (
                         <span
                              key={index}
                              className="text-xs text-gray-500 dark:text-gray-400"
                         >
                              {item.label}
                         </span>
                    ))}
               </div>
          </div>
     )
}

export default SimpleLineChart
