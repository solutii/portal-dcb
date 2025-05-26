import React, { FC, ReactNode } from 'react'

import { Modal as MUIModal, Box, IconButton } from '@mui/material'
import { Close } from '@mui/icons-material'

import appTheme from '../../../assets/styles/theme'
import './styles.scss'

interface ModalProps {
  isEnabled: boolean
  title?: string
  style?: any
  onClose?: () => void
  children?: ReactNode
}

const Modal: FC<ModalProps> = ({ isEnabled, title, style, onClose, children, ...rest }): JSX.Element => {
  const closeModal = () => onClose && onClose()
    
	const handleCloseButtonClick = () => closeModal()
  const handleModalClose = () => closeModal()
  
  const wrapperStyle = {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    width: '85%',
    maxWidth: 600,
    height: 'auto',
    maxHeight: 700,
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.default',
    borderRadius: 5,
    border: '2px solid gray',
    boxShadow: 24,
    px: 3,
    py: 2,
    overflowY: 'auto',
    overflowX: 'hidden',
  }

  return <MUIModal 
    open={isEnabled} 
    onClose={handleModalClose}
    disableEnforceFocus
    disableAutoFocus
    {...rest}
  >
    <Box sx={{ ...wrapperStyle, ...style }}>
      <div className='title'>
        <h2>{ title }</h2>
        <IconButton 
          onClick={handleCloseButtonClick}  
          style={{ 
            width: 40, 
            height: 40, 
            marginLeft: 'auto',
            color: appTheme.palette.secondary.main 
          }}
        >
          <Close />
        </IconButton> 
      </div>
      { children }
    </Box>
  </MUIModal>
}

export default Modal
