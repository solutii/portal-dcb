import React, { FC } from 'react'
import { Navigate, RouteProps, useLocation } from 'react-router-dom'

import { useStore } from '../store'

type AuthenticatedRouteProps = RouteProps & {
  children: JSX.Element
}

const AuthenticatedRoute: FC<AuthenticatedRouteProps> = ({ children }: AuthenticatedRouteProps): JSX.Element => {
  const { authReducer: { state: authState } } = useStore()

  const location = useLocation()

  return authState.isAuthenticated || location.pathname === '/login' ?
    children
  :
    <Navigate to='/login' state={{ from: window.location.pathname }} replace />
}


export default AuthenticatedRoute
