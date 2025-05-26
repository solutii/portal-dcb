
import React, { FC, createContext, useContext, useReducer, ReactNode } from 'react'

import type { AuthReducer } from '../../../modules/authentication/models'
import type { CompanyReducer } from '../../../modules/company/models'
import type { CustomerReducer } from '../../../modules/customer/models'
import type { OrderReducer } from '../../../modules/order/models'
import type { ProductReducer } from '../../../modules/product/models'

import { authInitialState, authReducer } from '../../../modules/authentication/reducer'
import { customerInitialState, customerReducer } from '../../../modules/customer/reducer'
import { companyInitialState, companyReducer } from '../../../modules/company/reducer'
import { orderInitialState, orderReducer } from '../../../modules/order/reducer'
import { productInitialState, productReducer } from '../../../modules/product/reducer'


export interface Store {
  authReducer: AuthReducer
  customerReducer: CustomerReducer
  companyReducer: CompanyReducer
  orderReducer: OrderReducer
  productReducer: ProductReducer
  children?: ReactNode
}

const emptyStore: Store = {
  authReducer: { state: authInitialState, dispatch: () => {} },
  customerReducer: { state: customerInitialState, dispatch: () => {} },
  companyReducer: { state: companyInitialState, dispatch: () => {} },
  orderReducer: { state: orderInitialState, dispatch: () => {} },
  productReducer: { state: productInitialState, dispatch: () => {} },
}

const StoreContext = createContext<Store>(emptyStore)

export const StoreProvider: FC<any> = ({ children }: any): JSX.Element => {
  const [ authState, authDispatch ] = useReducer(authReducer, authInitialState)
  const [ customerState, customerDispatch ] = useReducer(customerReducer, customerInitialState)
  const [ companyState, companyDispatch ] = useReducer(companyReducer, companyInitialState)
  const [ orderState, orderDispatch ] = useReducer(orderReducer, orderInitialState)
  const [ productState, productDispatch ] = useReducer(productReducer, productInitialState)

  const store = {
    authReducer: { state: authState, dispatch: authDispatch },
    customerReducer: { state: customerState, dispatch: customerDispatch },
    companyReducer: { state: companyState, dispatch: companyDispatch },
    orderReducer: { state: orderState, dispatch: orderDispatch },
    productReducer: { state: productState, dispatch: productDispatch},
  }

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
