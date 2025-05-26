import React, { FC, CSSProperties } from 'react'
import { ResponsiveContainer, PieChart, Pie } from 'recharts'

import { formatCurrency } from '../../utils/currency'

import CustomPieChartLabel from './label/PieChartLabel'

import appTheme from '../../../assets/styles/theme'


interface CustomPieChartProps {
  title: string
  data: any
  currency?: boolean
  containerStyle?: CSSProperties
}

const CustomPieChart: FC<CustomPieChartProps> = ({ title = '', data, currency = false,  containerStyle }: CustomPieChartProps) => {
  data = data.filter((row: any) => row.value > 0)
  const valueSum = data.reduce((acc: number, { value }: typeof data) => acc + value, 0)
  
  return <div style={{ 
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'flex-start',
    width: '100%',
    color: appTheme.palette.secondary.main,
    ...containerStyle 
  }}>
    <h2 style={{ margin: '0 auto' }}>{title}</h2>
    { valueSum ? <ResponsiveContainer width='100%' height='100%'>
       <PieChart margin={{ top: 35 }}>
          <Pie
            data={data}
            dataKey='value'
            cx='50%'
            cy='50%'
            innerRadius={95}
            outerRadius={120}
            fill={appTheme.palette.primary.main}
            label={(props: any) => <CustomPieChartLabel { ...{ ...props, data, currency }} />}
          /> 
        </PieChart>
      </ResponsiveContainer>
    : null }
    <h3 style={{ margin: '25px auto 0' }}>
      Total: {currency ? formatCurrency(data.reduce((prev: any, curr: any) => prev + curr.value, 0)) : data.reduce((prev: any, curr: any) => prev + curr.value, 0)}
    </h3>
  </div>
}

export default CustomPieChart