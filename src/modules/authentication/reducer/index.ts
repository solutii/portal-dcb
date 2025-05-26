import { AuthState, AuthStateActions } from '../models'

export const authInitialState: AuthState = {
  authUserEmail: '',
  isAuthenticated: false
}

export function authReducer(state: AuthState, action: AuthStateActions): AuthState {
  switch (action.type) {
    case 'SET_AUTHENTICATION':
      return { ...state, ...action.payload }
    case 'RESET_AUTHENTICATION':
        return authInitialState
    default: 
      return state
  }
}
