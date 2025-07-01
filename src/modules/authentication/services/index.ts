import type { Dispatch } from 'react'
import { toast } from 'react-toastify'
import Cookies from 'universal-cookie'

import type { Company } from '../../company/models'
import type { AuthPayload, AuthState, AuthStateActions } from '../models'
import type { Customer } from '../../customer/models'
import type { Store } from '../../../shared/infra/store'

import api from '../../../shared/infra/services/api'
import { mainAppDispatch } from '../../../shared/infra/services/app'

const cookies = new Cookies();

const storeAuth = (dispatch: Dispatch<AuthStateActions>, payload: AuthState) => 
  dispatch({ type: 'SET_AUTHENTICATION', payload })




export const isUserLogged = (store: Store): boolean => {
  try {
    var data = JSON.parse(sessionStorage.getItem('data')||'');
    var email = cookies.get('email');
    if(data != null && data != undefined && data != ''
    && email != null && email != undefined && email != '') {
      (data[0] as Customer).A1_LOJA = '01'
      ;(data[0] as Customer).A1_FILIAL = '0101'

      storeAuth(
        store.authReducer.dispatch, 
        { authUserEmail: email, isAuthenticated: true }
      )

      mainAppDispatch(
        data[0] as Customer,
        data as Company[],
        store,
      )

      return true;
  } else {
    return false;
  }
  } catch (err) {
    toast((err as Error)?.message, {autoClose: 15000})
    console.log(err)
    return false
  }
}

export const signIn = async ({ LOGIN, SENHA }: AuthPayload, store: Store): Promise<boolean> => {
  try {
    const response = await api.post('/USUARIOLOGIN', { LOGIN, SENHA })
    api.handleResponse(response);

    var stringData = JSON.stringify(response.data.dados);
    sessionStorage.setItem('data', stringData);
    //cookies.set('stringData', stringData, { path: '/' });
    cookies.set('email', LOGIN, { path: '/' });

    /* (response.data.dados[0] as Customer).A1_LOJA = '01';
    (response.data.dados[0] as Customer).A1_FILIAL = '01'; */

    storeAuth(
      store.authReducer.dispatch, 
      { authUserEmail: LOGIN, isAuthenticated: true }
    )

    mainAppDispatch(
      response.data.dados[0] as Customer,
      response.data.dados as Company[],
      store
    )

    return true

  } catch (err) {
    toast((err as Error)?.message, {autoClose: 15000})
    console.log(err)
    return false
  }
}

export const changePassword = async ({ LOGIN, newPassword }: any) => {
  try {
    await api.post('/USUARIOSENHA', { LOGIN, SENHA: newPassword })
    toast('Senha alterada com sucesso')
  } catch (err) {
    toast((err as Error)?.message)
    console.log((err as Error)?.message, {autoClose: 15000})
  }
}

export const signOut = async (navigate: any, dispatch: Dispatch<AuthStateActions>): Promise<void> => {
  cookies.remove('data');
  cookies.remove('email');
  dispatch({ type: 'RESET_AUTHENTICATION' })
  navigate('/login')
}

export const initializeAutoLogOffWorker = (navigate: any, dispatch: Dispatch<AuthStateActions>) => 
  setTimeout(() => (async () => signOut(navigate, dispatch))(), 1000 * 60 * 15)