import type { Dispatch } from 'react'

export interface Customer {
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
}

export interface CustomerCompanies {
  CODIGO: string
  NOME: string
}

export interface CustomerFranchiseAmountReport {
  FILIAL: string
  EMISSAO: string
  VALOR: string
}

export interface CustomerFranchiseQuantityReport {
  FILIAL: string
  QUANTIDADE: string
}

export interface CustomerProductAmountReport {
  PRODUTO: string
  DESCRICAO: string
  VALOR: string
}

export type CustomerPayableStatus = '0' | '1' | '2' | '3' | string

export const customerPayableStatus: Record<CustomerPayableStatus, string> = {
  '0': 'Título em Aberto',
  '1': 'Título em Aberto e Atrasado',
  '2': 'Título Baixado Parcialmente',
  '3': 'Título Pago'
}

export interface CustomerPayable {
  E1_PREFIXO: string
  E1_NUM: string
  E1_PARCELA: string
  E1_TIPO: string
  E1_EMISSAO: string
  E1_VENCREA: string
  E1_VALOR: number
  E1_MULTA: number
  E1_JUROS: number
  E1_BAIXA?: string
  STATUS: CustomerPayableStatus
}

export interface CustomerPayableRequest {
  CLIENTE: string
  LOJA: string
  DATAINI: string
  DATAFIM: string
}

export interface CustomerPayablePix {
  IMAGEM: string
}

export interface CustomerPayableDetailRequest {
  PREFIXO: string
  NUM?: string
  NUMERO?: string
  PARCELA: string
  TIPO: string
  FILIAL?: string
}

export interface CustomerState {
  customer: Customer
  payable: CustomerPayable[]
  all: Customer[]
  loading: {
    loading: boolean
    loadingId: string
  }
}

export const PAYABLE_PAID_STATUS = '3'

export type CustomerStateActions = 
  { type: 'SET_CUSTOMER', payload: Customer } |
  { type: 'SET_ALL', payload: Customer[] } |
  { type: 'SET_CUSTOMER_PAYABLE', payload: CustomerPayable[] } |
  { type: 'SET_LOADING', payload: { loading: boolean, loadingId: string},} 

export interface CustomerReducer {
  state: CustomerState
  dispatch: Dispatch<CustomerStateActions>
}
