
import React, { FC, CSSProperties, useState } from 'react'
import { Link } from 'react-router-dom'

import { Collapse } from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'

import './Option.scss'

interface OptionProps {
	label: string
	to: string
  optionIndex: number
  onClick?: (optionIndex: number) => void
  subOptions?: any[]
  style?: CSSProperties
}

const OptionLabel: FC<any> = ({ to, label, onClick }): JSX.Element => // eslint-disable-next-line jsx-a11y/anchor-is-valid 
  to ? <Link to={to} onClick={onClick}>{ label }</Link> : <a onClick={onClick}>{ label }</a> 

const ExpandableOption = ({ label, to, subOptions = [] }: any) => {
	const [open, setOpen] = useState(false)

	const handleSubOptionClick = () => setOpen(!open)
  
	return <div className='sub-option'>
    <div className='flex flex-center'>
      { label }
      { open ? <ExpandLess onClick={handleSubOptionClick}/> : <ExpandMore onClick={handleSubOptionClick}/> }
    </div>
    <Collapse in={open} timeout="auto" unmountOnExit>
      <div className='flex flex-column'>
        { subOptions.map((subOption: any, i: number) => 
          <div className='option' key={i}>
            <OptionLabel 
              to={subOption.to} 
              onClick={subOption.fn} 
              label={subOption.label} 
            />
          </div>
        )}
      </div>
    </Collapse>
  </div>
}

const Option: FC<OptionProps> = ({ label = '', to = '', optionIndex, onClick, subOptions = [], style = {} }: OptionProps) => {
	const handleOptionClick = () => { 
    if (onClick) 
      onClick(optionIndex)
  }

  return <div className='option' style={style}>
    { subOptions.length > 0 ? 
        <ExpandableOption options={subOptions} label={label} /> 
      : 
        <OptionLabel 
          to={to} 
          label={label}
          onClick={handleOptionClick} 
        />
    }
	</div>
}

export default Option
