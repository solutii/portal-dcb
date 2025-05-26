import { ProductState, ProductStateActions } from '../models'

export const productInitialState: ProductState = {
  products: [],
  loading: {
    products: false,
    product: false
  }
}

export function productReducer(state: ProductState, action: ProductStateActions): ProductState {
  switch (action.type) {
    case 'SET_PRODUCTS': 
      return { ...state, products: action.payload }
    case 'SET_LOADING': 
      return { ...state, loading: { ...state.loading, ...action.payload } }
    default: 
      return state
  }
}
