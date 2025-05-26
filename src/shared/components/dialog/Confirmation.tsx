import React, { FC, CSSProperties, ReactNode } from 'react'

import { Modal, Box } from '@mui/material'

import './Confirmation.scss'
import Button from '../button/Button'

interface ConfirmationProps {
	enabled: boolean
	message?: string
  onResult: (result: boolean, ...args: any[]) => Promise<void>
	style?: CSSProperties
	children?: ReactNode
}

const Confirmation: FC<ConfirmationProps> = ({ children, onResult, enabled, message, style = {}}: ConfirmationProps) =>
	<div className='dialog-overlay'>
		<Modal
			open={enabled}
			onClose={() => onResult(false)}
		>
			<Box sx={{
				display: 'flex',
				flexFlow: 'column',
				alignItems: 'center',
				width: 550,
				position: 'absolute' as 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				height: '100%',
				maxHeight: 215,
				bgcolor: 'background.paper',
				borderRadius: 5,
				border: '2px solid gray',
				boxShadow: 24,
				px: 3,
				py: 2
			}}>
				<div className='message flex flex-center'>{ message }</div>
				{ children }
				<div className='action-ctn'>
					<Button style={{ background: 'black', color: '#f6f6fade', width: 180 }} onClick={() => onResult(true)}>Ok</Button>
					<Button style={{ background: 'black', color: '#f6f6fade', width: 180 }} onClick={() => onResult(false)}>Cancelar</Button>
				</div>
			</Box>

		</Modal>
</div>


export default Confirmation
