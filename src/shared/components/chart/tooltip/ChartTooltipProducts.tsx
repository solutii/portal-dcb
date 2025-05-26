import React, { FC } from 'react'

import { formatCurrency } from '../../../utils/currency'

import './index.scss'

interface CustomChartTooltipProductsProps {
  active?: boolean
  payload?: any
  fieldsToCurrencyFormat?: string[]
}

const CustomChartTooltipProducts: FC<CustomChartTooltipProductsProps> = ({ active, payload, fieldsToCurrencyFormat = [] }: CustomChartTooltipProductsProps) => {  
  debugger
  if (!active || !payload) 
    return null

  return <div className='custom-tooltip'>
   { payload[0] && Object.entries(payload[0].payload)
      .map(([key, value], i) => {
          if (key === 'Produto')
            return

          if (key === 'Nome')
            return <p className='label'>Nome: { value as string }</p>

          if (key === 'Total')
          return <p className='value' key={i}>{ `${key.charAt(0).toUpperCase()}${key.slice(1)}` }: { formatCurrency(value as number) }</p>
          
          return <p className='value' key={i}>{ `${key.charAt(0).toUpperCase()}${key.slice(1)}` }: { fieldsToCurrencyFormat.includes(key) ? formatCurrency(value as number) : String(value) }</p>
        }
      ) 
    }
  </div>
}

export default CustomChartTooltipProducts
