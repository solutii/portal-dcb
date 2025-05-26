
import React, { FC, CSSProperties, ReactNode } from 'react'
import { Button as MUIButton } from '@mui/material'
import { Loader } from '../loader'

import appTheme from '../../../assets/styles/theme'

import './Button.scss'

interface ButtonProps {
  children?: ReactNode
  onClick: () => void
  style?: CSSProperties
  type?: string
  disabled?: boolean
  loading?: boolean
}

const Button: FC<ButtonProps> = ({ children, onClick, type, disabled, loading, style }: ButtonProps): JSX.Element => 
  <MUIButton 
    style={{ 
      background: appTheme.palette.primary.main,
      color: appTheme.palette.secondary.main,
      boxShadow: '1px 1px 4px gray',
      borderRadius: 30,
      ...style 
    }} 
    onClick={onClick} 
    disabled={disabled}
  >
    { loading ? 
      <Loader 
        width={27} 
        height={27}
        containerStyle={{ marginTop: 5 }} 
        color={style?.color || appTheme.palette.secondary.main}
      /> 
    : 
      children }
  </MUIButton>

export default Button