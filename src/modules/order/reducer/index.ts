
import { handleDateFormattingForDateInput, formatDate } from '../../../shared/utils/date'
import { OrderState, OrderStateActions } from '../models'

export const orderInitialState: OrderState = {
  order: {
    Z8_NUM: '',
    Z8_TIPO: '',
    Z8_CLIENTE: '',
    Z8_TPFRETE: '',
    Z8_LOJA: '',
    Z8_COND: '',
    Z8_FILIAL: '',
    Z8_VEND: '',
    Z8_EMISSAO: handleDateFormattingForDateInput(formatDate(Date.now())),
    Z8_STATUS: '',
    Z8_DESC: 0,
    Z8_TOTAL: 0,
    TOTAL: 0,
    FATURADO: 0,
    QTDITEM: 0,
    STATUS: 'A',
  },
  orderItem: {
    Z9_NUM: '',
    Z9_FILIAL: '',
    Z9_ITEM: '',
    Z9_PRODUTO: '',
    Z9_DESCR: '',
    Z9_QUANT: 0,
    Z9_VSUG: 0,
    Z9_VUNIT: 0,
    Z9_VDESC: 0, 
    Z9_TOTAL: 0,
    ESTOQUE: 0
  },
  orders: [],
  lastOrderItems: [],
  orderPaymentMethods: [],
  loading: {
    orders: false,
    orderItems: false,
    ordersItems: false,
    order: ''
  }
}

export function orderReducer(state: OrderState, action: OrderStateActions): OrderState {
  switch (action.type) {
    case 'SET_ORDER': 
      return { ...state, order: action.payload }
    case 'ADD_ORDER': 
      return { ...state, orders: [ ...state.orders, action.payload ] }
    case 'SET_LAST_ORDER_ITEMS': 
      return { ...state, lastOrderItems: action.payload }
    case 'RESET_ORDER': 
      return { ...state, order: { ...orderInitialState.order, Z8_EMISSAO: handleDateFormattingForDateInput(formatDate(Date.now())), } }
    case 'SET_ORDERS': 
      return { ...state, orders: action.payload }
    case 'SET_LOADING': 
      return { ...state, loading: { ...state.loading, ...action.payload } }
    case 'SET_ORDER_PAYMENT_METHODS': 
      return { ...state, orderPaymentMethods: action.payload }
    default: 
      return state
  }
}
