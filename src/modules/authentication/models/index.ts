import type { Dispatch } from 'react'

export interface AuthPayload {
  LOGIN: string
  SENHA: string
}

export interface AuthState {
  authUserEmail: string
  isAuthenticated: boolean
}

export type AuthStateActions = 
  { type: 'SET_AUTHENTICATION', payload: AuthState } | 
  { type: 'RESET_AUTHENTICATION' }

export interface AuthReducer {
  state: AuthState
  dispatch: Dispatch<AuthStateActions>
}
