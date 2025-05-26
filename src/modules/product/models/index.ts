import type { Dispatch } from 'react'

export interface Product {
  B1_COD: string
  B1_DESC: string
  B1_TIPO: string
  B1_UM: string
  B1_LOCPAD: string
  B1_PE: string
  ESTOQUE: number
  PRCVEN: number
}

export type AddingProduct = Product & { quantity: number, price: number }

export interface ProductStockRequest {
  FILIAL: string
  NUMERO: string
}

export interface ProductState {
  products: Product[]
  loading: {
    products: boolean
    product: boolean
  }
}

export type ProductStateActions = 
  { type: 'SET_PRODUCTS', payload: Product[] } |
  { type: 'SET_LOADING', payload: { [key: string]: boolean } } 

export interface ProductReducer {
  state: ProductState
  dispatch: Dispatch<ProductStateActions>
}
