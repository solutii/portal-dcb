import React, { FC } from 'react'
import { formatCurrency } from '../../../utils/currency'

interface CustomPieChartLabelProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  value: number
  index: number
  data: any
  currency?: boolean
}

const CustomPieChartLabel: FC<CustomPieChartLabelProps> = (
  { data, cx, cy, midAngle, innerRadius, outerRadius, value, index, currency }: CustomPieChartLabelProps
) => {
  const RADIAN = Math.PI / 180
  const radius = 25 + innerRadius + (outerRadius - innerRadius)
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN) - 15

  return <text
    x={x}
    y={y}
    fill='#8884d8'
    textAnchor={x > cx ? 'start' : 'end'}
    dominantBaseline='central'
    style={{ whiteSpace: 'pre-line' }}
  >
    {data[index].name} {'\n'} ({currency ? formatCurrency(value) : value })
  </text>
}

export default CustomPieChartLabel
