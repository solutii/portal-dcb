import type { Dispatch } from 'react'

export interface Company {
  A1_COD: string
  A1_FILIAL: string
  A1_LOJA: string 
  A1_NOME?: string
  A1_NREDUZ?: string  
  A1_END?: string  
  A1_BAIRRO?: string  
  A1_MUN?: string  
  A1_EST?: string  
  A1_CEP?: string  
  A1_DDD?: string  
  A1_TEL?: string  
  A1_TELEX?: string  
  A1_FAX?: string  
  A1_CONTATO?: string
  A1_CGC?: string
  FILIAL: '0101'
}

export interface CompanyState {
  company: Company
  companies: Company[]
}

export type CompanyStateActions = 
  { type: 'SET_COMPANY', payload: Company } | 
  { type: 'SET_COMPANIES', payload: Company[] }

export interface CompanyReducer {
  state: CompanyState
  dispatch: Dispatch<CompanyStateActions>
}
