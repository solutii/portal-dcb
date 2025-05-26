
import React, { type SyntheticEvent, type CSSProperties, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tabs, Tab as MUITab } from '@mui/material'

import './Tab.scss'

interface TabProps {
  options: { label: string; to: string }[]
  style?: CSSProperties
}

const Tab: React.FC<TabProps> = ({ options, style }: TabProps): JSX.Element => {
  const navigate = useNavigate()
  const [value, setValue] = useState(0)

  const handleChange = (_: SyntheticEvent, value: number): void => {
    setValue(value)
    navigate(options[value].to)
  }

  const initialTab = window.location.pathname;

  useEffect(() => {

    if(window.location.pathname === "/settings") {
      setValue(3)
    }

  },  [])
  
  return <Tabs
    selectionFollowsFocus
    className='layout-tab' 
    value={value} 
    onChange={handleChange}
    style={{ ...style }}
    variant='scrollable'
    scrollButtons='auto'
    textColor='primary'
    indicatorColor='primary' 
  >
    { options.map((option, i) => <MUITab label={option.label} key={i} />) }
  </Tabs>
}

export default Tab
