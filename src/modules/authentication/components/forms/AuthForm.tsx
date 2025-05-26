
import React, { FC } from 'react'

import type { AuthPayload } from '../../models'

import { cnpjCpfPattern } from '../../../../shared/utils/validations'

import CustomForm from '../../../../shared/components/form/Form'

interface AuthFormProps {
  isEmailFieldVisible?: boolean
  isPasswordFieldVisible?: boolean
  isConfirmPasswordFieldVisible: boolean
  onSubmit: (authPayload: AuthPayload) => Promise<void>
}

const AuthForm: FC<AuthFormProps> = ({ isEmailFieldVisible = true, isPasswordFieldVisible = true, isConfirmPasswordFieldVisible, onSubmit }): JSX.Element => {
  const handleSubmit = onSubmit

  const fields: any = [
    ...(isEmailFieldVisible ? [{
      type: 'text',
      name: 'LOGIN',
      label: 'Login',
      rules: {
        pattern: cnpjCpfPattern,
        required: true
      }
    }] : []),
    ...(isPasswordFieldVisible ? [{
      type: 'password',
      name: 'SENHA',
      label: 'Senha',
      rules: { required: true }
    },
    ] : []),
    ...(isConfirmPasswordFieldVisible ? [{
      type: 'password',
      name: 'newPassword',
      label: 'Nova Senha',
      rules: { required: true }
    },
    ] : []),
    ...(isConfirmPasswordFieldVisible ? [{
      type: 'password',
      name: 'passwordConfirmation',
      label: 'Confirmar Senha',
      rules: { required: true }
    },
    ] : []),
    {
      name: 'submit',
      type: 'submit',
      label: isConfirmPasswordFieldVisible ? 
        'Alterar e Entrar'
      :
        'Entrar'
    }
  ]
  
  return <CustomForm 
    fields={fields}
    onSubmit={handleSubmit} 
    values={{ LOGIN: '', SENHA: '' }}
    style={{
      width: '95%',
      maxWidth: 500,
      marginTop: 25,
      overflowY: 'hidden'
    }}
  />
 
}

export default AuthForm
