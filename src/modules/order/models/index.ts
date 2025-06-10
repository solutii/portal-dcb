import type { Dispatch } from 'react'

export interface Order {
  C5_NUM?: string
  C5_FILIAL?: string
  C5_TPFRETE: string
  C5_TIPO: string
  C5_CLIENTE: string
  C5_LOJA: string
  C5_VEND?: string
  C5_COND: string
  C5_EMISSAO: string
  C5_STATUS: string
  C5_DESC: number
  C5_TOTAL: number  
  QTDITEM: number
  TOTAL: number
  FATURADO: number
  STATUS: OrderStatus
  items?: OrderItem[]
  taxes?: OrderTax[]
}

export interface OrderItem {
  C6_NUM?: string
  C6_FILIAL?: string 
  C6_ITEM?: string
  C6_LOCAL?: string
  C6_PRODUTO: string
  C6_DESCRI?: string
  C6_QTDVEN: number
  C6_PRCVEN: number
  C6_PRCUNI: number
  C6_VDESC?: number
  C6_TOTAL: number
  ESTOQUE?: number
  AUTDELETA?: 'S' | 'N'
}

export interface OrderRequest {
  FILIAL: string
  CLIENTE?: string
  LOJA?: string
  DATAINI?: string
  DATAFIM?: string
  NUMERO?: string
}

export interface OrderCRUDRequest {
  FILIAL: string,
  CABEC: Omit<Order, 'QTDITEM' | 'TOTAL' | 'FATURADO' | 'STATUS'>
  ITEM: any[]
}

export interface OrderDetailRequest {
  FILIAL: string
  NUMERO: string
}

export type OrderStatus = '0' | '1' | '2' | '3' | '4' | '5' | '7' | '8'

export const orderStatusLabels: Record<OrderStatus, string> = {
  '0': "Em Aberto",
  '1': "Encerrado",
  '2': "Liberado - Blq. Crédito/Estoque",
  '3': "Liberado - Sem Bloqueio",
  '4': "com Bloqueio de Regra",
  '5': "com Bloqueio de Verba",
  '7': "Parcialmente Faturado",
  '8': "Totalmente Faturado"
}

export interface OrderPaymentMethod {
  E4_CODIGO: string
  E4_COND: string
  E4_DESCRI: string
}

export interface OrderTax {
  CODIGO: string
  E4_COND: string
  BASE: number
  ALIQUOTA: number
  VALOR: number
}

export interface OrderState {
  order: Order
  lastOrderItems: OrderItem[]
  orders: Order[]
  orderItem: OrderItem
  orderPaymentMethods: OrderPaymentMethod[]
  loading: {
    orders: boolean
    orderItems: boolean
    ordersItems: boolean
    order: string 
  }
}

export type OrderStateActions = 
  { type: 'SET_ORDER', payload: Order } | 
  { type: 'ADD_ORDER', payload: Order } |
  { type: 'SET_LAST_ORDER_ITEMS', payload: OrderItem[] } |
  { type: 'RESET_ORDER' } | 
  { type: 'SET_ORDERS', payload: Order[] } |
  { type: 'SET_LOADING', payload: { [key: string]: boolean | string } } | 
  { type: 'SET_ORDER_PAYMENT_METHODS', payload: OrderPaymentMethod[] }
 
export interface OrderReducer {
  state: OrderState
  dispatch: Dispatch<OrderStateActions>
}
