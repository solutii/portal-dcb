import React, { FC } from 'react'

import { formatCurrency } from '../../../utils/currency'

import './index.scss'

interface CustomChartTooltipProps {
  active?: boolean
  label: string
  payload?: any
  fieldsToCurrencyFormat?: string[]
}

const CustomChartTooltip: FC<CustomChartTooltipProps> = ({ active, label, payload, fieldsToCurrencyFormat = [] }: CustomChartTooltipProps) => {  
  if (!active || !payload) 
    return null

  return <div className='custom-tooltip'>
   { label && <p className='label'>{ label }</p> }
   { payload[0] && Object.entries(payload[0].payload)
      .map(([key, value], i) => {
          if (key === 'name')
            return null
          
          return <p className='value' key={i}>{ `${key.charAt(0).toUpperCase()}${key.slice(1)}` }: { fieldsToCurrencyFormat.includes(key) ? formatCurrency(value as number) : String(value) }</p>
        }
      ) 
    }
  </div>
}

export default CustomChartTooltip
