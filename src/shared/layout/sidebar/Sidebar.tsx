
import React, { CSSProperties, FC } from 'react'

import Option from './option/Option'

import './Sidebar.scss'

interface SidebarProps {
	enabled?: boolean
	options: any[]
	onOptionClick?: (optionIndex: number) => any
	style?: CSSProperties
}

const Sidebar: FC<SidebarProps> = ({ enabled = true, options = [], style = {}, onOptionClick }: SidebarProps) => {
	const handleOptionClick = (optionIndex: number) => onOptionClick && onOptionClick(optionIndex)

	return <aside style={{ ...style, display: enabled ? 'block' : 'none' }}>
		{ options.map((option, i) => 
			<Option 
				key={i} 
				label={option.label} 
				to={option.to}
				optionIndex={i}
				onClick={handleOptionClick}
				subOptions={option.children?.length > 0 ? option.children : []}
			/>) 
		}
	</aside>
}

export default Sidebar
