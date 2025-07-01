
import { handleDateFormattingForDateInput, formatDate } from '../../../shared/utils/date'
import { OrderState, OrderStateActions } from '../models'

export const orderInitialState: OrderState = {
  order: {
    C5_NUM: '',         // Número do pedido
    C5_TIPO: '',        // Tipo do pedido
    C5_CLIENTE: '',     // Código do cliente
    C5_TPFRETE: '',     // Tipo de frete
    C5_LOJA: '',        // Loja do cliente
    C5_COND: '',        // Condição de pagamento
    C5_FILIAL: '',      // Filial
    C5_VEND: '',        // Vendedor
    C5_EMISSAO: handleDateFormattingForDateInput(formatDate(Date.now())), // Data de emissão
    C5_STATUS: '',      // Status do pedido
    C5_DESC: 0,         // Desconto
    C5_TOTAL: 0,        // Total do pedido
    TOTAL: 0,           // Total geral
    FATURADO: 0,        // Valor faturado
    QTDITEM: 0,         // Quantidade de itens
    STATUS: '0',        // Status adicional
  },
  orderItem: {
    C5_NUM: '',         // Número do pedido
    C6_FILIAL: '',      // Filial
    C6_ITEM: '',        // Item
    C6_PRODUTO: '',     // Código do produto
    B1_DESC: '',      // Descrição do produto
    C6_QTDVEN: 0,       // Quantidade vendida
    C6_PRCVEN: 0,       // Preço de venda
    C6_PRCUNI: 0,       // Preço unitário
    C6_VDESC: 0,        // Valor do desconto
    C6_VALOR: 0,        // Total do item
    ESTOQUE: 0          // Estoque
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
      return { ...state, order: { ...orderInitialState.order, C5_EMISSAO: handleDateFormattingForDateInput(formatDate(Date.now())), } }
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
