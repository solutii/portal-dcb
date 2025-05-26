import React, { FC, ReactNode, CSSProperties } from 'react'
import { Card as MUICard, CardContent as MUICardContent, SxProps, Theme } from '@mui/material'
import { Loader } from '../loader'

import appTheme from '../../../assets/styles/theme'
import './Card.scss'
 
interface CardProps {
  title?: string
  content?: string | number
  width?: number
  style?: SxProps<Theme> | CSSProperties
  contentStyle?: SxProps<Theme> | CSSProperties
  children?: ReactNode
  loading?: boolean
}

const Card: FC<CardProps> = ({ title, content, width = 250, style, loading, contentStyle, children }: CardProps): JSX.Element => {
  return <MUICard sx={{ 
    width, 
    height: 'min-content',
    borderRadius: 2,
    border: '1px solid #3b3e63',
    //borderTop: `11px solid ${appTheme.palette.primary.main}`,
    background: appTheme.palette.background.default,
    py: 4,
    mt: 2,
    ...style
  }}>
    { title && <h2 className='card-title'>{ title }</h2> }
    { loading ? 
        <Loader 
          width={50} 
          height={50}
          color='lightgray'
          containerStyle={{ 
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            marginTop: 20
          }} 
        />
      : 
        <MUICardContent sx={{
          display: 'flex',
          flexFlow: 'column',
          alignItems: 'center',
          color: '#f6f6fade',
          ...contentStyle
        }}>
          { content && <span className='card-content'>{ String(content || 0) }</span> }
          { children }
        </MUICardContent>
    }
  </MUICard>
}
  
export default Card