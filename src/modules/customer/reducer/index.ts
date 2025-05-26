import type { CustomerState, CustomerStateActions } from '../models'

export const customerInitialState: CustomerState = {
  customer: {
    A1_COD: '',
    A1_LOJA: '',
    A1_FILIAL: '',
    A1_NOME: '',
    A1_NREDUZ: '',
    A1_END: '',
    A1_BAIRRO: '',
    A1_MUN: '',
    A1_EST: '',
    A1_CEP: '',
    A1_DDD: '',
    A1_TEL: '',
    A1_TELEX: '',
    A1_FAX: '',
    A1_CONTATO: '',
  },
  all: [],
  payable: [],
  loading: {
    loading: false,
    loadingId: ''
  }
}

export function customerReducer(state: CustomerState, action: CustomerStateActions): CustomerState {
  switch (action.type) {
    case 'SET_CUSTOMER':
      return { ...state, customer: action.payload }
    case 'SET_CUSTOMER_PAYABLE':
      return { ...state, payable: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ALL':
      return { ...state, all: action.payload }
    default: 
      return state
  }
}
