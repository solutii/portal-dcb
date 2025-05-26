import type { Dispatch } from 'react'

export interface Order {
  Z8_NUM?: string
  Z8_FILIAL?: string
  Z8_TPFRETE: string
  Z8_TIPO: string
  Z8_CLIENTE: string
  Z8_LOJA: string
  Z8_VEND?: string
  Z8_COND: string
  Z8_EMISSAO: string
  Z8_STATUS: string
  Z8_DESC: number
  Z8_TOTAL: number  
  QTDITEM: number
  TOTAL: number
  FATURADO: number
  STATUS: OrderStatus
  items?: OrderItem[]
  taxes?: OrderTax[]
}

export interface OrderItem {
  Z9_NUM?: string
  Z9_FILIAL?: string 
  Z9_ITEM?: string
  Z9_PRODUTO: string
  Z9_DESCR?: string
  Z9_QUANT: number
  Z9_VSUG?: number
  Z9_VUNIT: number
  Z9_VDESC?: number
  Z9_TOTAL: number
  ESTOQUE?: number
  AUTDELETA?: 'S' | 'N'
}

export interface OrderRequest {
  FILIAL: string
  CLIENTE?: string
  LOJA?: string
  INICIO?: string
  FIM?: string
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

export type OrderStatus = 'A' | 'L' | 'B' | 'F' | 'M' | 'E' | 'P' | 'O' | 'N' | 'C'

export const orderStatusLabels: Record<OrderStatus, string> = {
  'A': 'Em aberto',
  'L': 'Liberado',
  'B': 'Liberação Comercial',
  'F': 'Liberação Financeira',
  'M': 'Efetivado Parcialmente',
  'E': 'Efetivado',
  'P': 'Faturado Parcialmente',
  'O': 'Faturado',
  'N': 'Negado',
  'C': 'Cancelado'
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
