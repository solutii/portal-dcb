
import React, { FC, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { type Store, useStore } from '../../shared/infra/store'
import { signIn, changePassword, isUserLogged } from '../../modules/authentication/services'

import AuthForm from '../../modules/authentication/components/forms/AuthForm'

import login from '../../assets/img/login.png'
import logo from '../../assets/img/logo_dcb.png'
import partner from '../../assets/img/partner.png'

import './index.scss'
import { toast } from 'react-toastify'
import MolduraVerde from './moldura'

const LoginPage: FC = (): JSX.Element => {
  const store: Store = useStore()

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  //const willChangePassword = searchParams.get('action') === 'changePassword'
  const [ willChangePassword, setWillChangePassword ] = useState<boolean>(false)
  const willSignUp = searchParams.get('action') === 'signUp'

  useEffect(() => {
    if(isUserLogged(store)){
      navigate('/orders');
    }
  });

  const handleAuthFormSubmit = async (data: any) => {

    if (willSignUp) {
      return
    }

    if (willChangePassword) {
      if (data.newPassword !== data.passwordConfirmation) {
        toast('As senhas não conferem.')
        return
      }

      if (data.newPassword === '123') {
        toast('Senha não permitida.')
        return
      }

      await changePassword(data)
        .then(() => {
          setWillChangePassword(false)
          navigate('/orders')
        })
        .catch()

      
      return
    }

    await signIn(data, store)
      .then(result => {
        if (!result) 
          return

        if (data.SENHA === '123') {
          toast('Necessário alterar sua senha.')
          setWillChangePassword(true)
          navigate('/settings')
          return
        }

        navigate('/orders')
      })
      .catch()

  }

  return <>
    <main className='login-page w-100 h-100 paddless'>
    <MolduraVerde />


    <div className='image-container'>
      <img className='login' src={login} alt='pneu'  />
    </div>
    <div className='form-container'>
      <img className='logo' src={logo} alt='logo' />
      <h2>PORTAL DO CLIENTE</h2>
      <AuthForm
        onSubmit={handleAuthFormSubmit}
        //isEmailFieldVisible={!willChangePassword}
        isPasswordFieldVisible={!willSignUp}
        isConfirmPasswordFieldVisible={willChangePassword}
      />
      {/* <img className='partner' src={partner} alt='dunloop' /> */}
    </div>
  </main>
  </>
}

export default LoginPage
