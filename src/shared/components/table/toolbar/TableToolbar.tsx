
import React, { FC, ReactNode } from 'react'

import { TextField } from '@mui/material'
import { Search } from '@mui/icons-material'

import './TableToolbar.scss'

interface TableToolbarProps {
  onSearchInputChange?: (value: string) => void
  children?: ReactNode
}

const TableToolbar: FC<TableToolbarProps> = ({ onSearchInputChange, children, ...rest }): JSX.Element => {
  const handleSearchTextFieldChange = (value: string) => onSearchInputChange!(value)

  return <div className='table-toolbar'>
    { children }
    { onSearchInputChange && <TextField 
      type='text'
      label='Digite o dado desejado'
      onChange={({ target: { value }}) => handleSearchTextFieldChange(value)}
      InputProps={{ endAdornment: <Search /> }}
      size='small'
      style={{
        margin: '0 auto 0 15px',
        width: 275,
      }}
    /> }
  </div>
}

export default TableToolbar
