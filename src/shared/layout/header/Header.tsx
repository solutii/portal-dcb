
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Menu, Logout } from '@mui/icons-material'
import logo from '../../../assets/img/logo/logo.png'

import './Header.scss'

interface HeaderProps {
  isLoggedIn?: boolean
  onMenuButtonClick: () => void
  onLogoutButtonClick: () => void
}

const Header: React.FC<HeaderProps> = ({ onMenuButtonClick, onLogoutButtonClick }: HeaderProps) => {
  const navigate = useNavigate()

  //const handleMenuButtonClick = () => onMenuButtonClick()
  const handleLogoClick = () => navigate('/')
  const handleLogoutButtonClick = () => onLogoutButtonClick()

  return <header>
    { /*<Menu onClick={handleMenuButtonClick} /> */}
    { /*<div className='logo-container'>
      <img src={logo} alt='logo' onClick={handleLogoClick}></img>
    </div> */ }
    <Logout className='logout' onClick={handleLogoutButtonClick} />
  </header>
}

export default Header
