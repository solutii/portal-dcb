import React, { FC, CSSProperties, ReactNode } from 'react'
import { IconButton, Tooltip } from '@mui/material'
//import * as MuiIcons from '@material-ui/icons'

interface TooltipIconButtonProps {
  title: string
  disabled?: boolean
  iconButtonStyle?: CSSProperties 
  onClick: () => any
  children?: ReactNode
}

const TooltipIconButton: FC<TooltipIconButtonProps> = ({ title,  disabled, iconButtonStyle,  onClick, children }: TooltipIconButtonProps): JSX.Element => {
  //const Icon = MuiIcons['']

  const handleIconButtonClick = onClick

  return <Tooltip title={<span>{title}</span>}>
    <IconButton onClick={handleIconButtonClick} disabled={disabled} style={iconButtonStyle}>
      { children }
    </IconButton>
  </Tooltip>
}

export default TooltipIconButton