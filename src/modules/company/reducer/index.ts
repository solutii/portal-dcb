import { CompanyState, CompanyStateActions } from '../models'

export const companyInitialState: CompanyState = {
  company: {
    A1_COD: '',
    A1_FILIAL: '',
    A1_LOJA: '',
    FILIAL: '01'
  },
  companies: []
}

export function companyReducer(state: CompanyState, action: CompanyStateActions): CompanyState {
  switch (action.type) {
    case 'SET_COMPANY': 
      return { ...state, company: action.payload }
    case 'SET_COMPANIES': 
      return { ...state, companies: action.payload }
    default: 
      return state
  }
}
