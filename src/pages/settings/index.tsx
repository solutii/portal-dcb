import React, { FC, useState, CSSProperties, useEffect } from 'react'
import { useStore } from '../../shared/infra/store'
import { toast } from 'react-toastify'
import './index.scss'
import ChangePasswordForm from '../../modules/authentication/components/forms/AuthRemenberForm'



const SettingsPage: FC = (): JSX.Element => {
  

  return <ChangePasswordForm  />
}

export default SettingsPage
