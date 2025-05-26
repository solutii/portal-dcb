import { Dispatch } from 'react'
import { toast } from 'react-toastify'

import type { Store } from '../../../shared/infra/store'
import type { Order, OrderItem, OrderDetailRequest, OrderRequest, OrderCRUDRequest, OrderStateActions, OrderPaymentMethod, OrderTax } from '../models'
import type { Company } from '../../company/models'
import type { Customer } from '../../customer/models'

import api from '../../../shared/infra/services/api'
import { formatDateToApiRequest, getReportCurrentPeriod } from '../../../shared/utils/date'
import { getProductDescriptionByID } from '../../product/services'
import { Api } from '@mui/icons-material'

export const getOrders = async (customer: Customer, company: Company, store: Store): Promise <Order[] | void> => {
  const { orderReducer: { dispatch } } = store

  const { firstDayOfMonth, lastDayOfMonth } = getReportCurrentPeriod()

  const orderRequest: OrderRequest = {
    CLIENTE: customer.A1_COD,
    FILIAL: company.FILIAL?? '01',
    LOJA: customer.A1_LOJA,
    INICIO: firstDayOfMonth,
    FIM: lastDayOfMonth
  }
  
  dispatch({ type: 'SET_LOADING', payload: { orders: true } })
  try {
    const response = await api.post('/COLETAPEDIDO', orderRequest)
    api.handleResponse(response)

    let orders: Order[] = response.data.dados
    orders?.sort((a, b) => ((a.Z8_NUM||"") > (b.Z8_NUM||"") ? -1 : 1))

    // const orders: Order[] = [
    //   {
    //     Z8_FILIAL: "01",
    //     Z8_NUM: "144509",
    //     Z8_TIPO: "1",
    //     Z8_CLIENTE: "056232",
    //     Z8_LOJA: "01",
    //     Z8_VEND: "000001",
    //     Z8_EMISSAO: "18/01/23",
    //     Z8_COND: "001",
    //     TOTAL: 10.54,
    //     FATURADO: 0,
    //     STATUS: "N",
    //     QTDITEM: 1
    //   },
    //   {
    //     Z8_FILIAL: "01",
    //     Z8_NUM: "144510",
    //     Z8_TIPO: "1",
    //     Z8_CLIENTE: "056232",
    //     Z8_LOJA: "01",
    //     Z8_VEND: "000001",
    //     Z8_EMISSAO: "18/01/23",
    //     Z8_COND: "001",
    //     TOTAL: 10.54,
    //     FATURADO: 0,
    //     STATUS: "N",
    //     QTDITEM: 1
    //   }
    // ]

    dispatch({ type: 'SET_ORDERS', payload: orders })
    dispatch({ type: 'SET_LOADING', payload: { orders: false } })

    return orders

  } catch (err) {
    toast('Falha ao obter os orçamentos')
    console.log(err)
  }
}

export const getOrderByID = async (orderID: string, company: Company, store: Store): Promise <Order | void> => {
  const { 
    orderReducer: { dispatch },
    customerReducer: { state: { customer }},
  }= store
  const orderRequest: OrderRequest = {
    FILIAL: company.FILIAL?? '01',
    NUMERO: orderID
  }

  try {
    const response = await api.post('/COLETAPEDIDO', orderRequest)
    api.handleResponse(response)

    const order: Order = response.data.dados[0]

    if (!order.items || !order.items.length)
      order.items = await getOrderItems(order.Z8_NUM!, store) as OrderItem[]

    // const order: Order = {
      
      // Z8_FILIAL: "01",
      // Z8_NUM: "144510",
      // Z8_TIPO: "1",
      // Z8_CLIENTE: "056232",
      // Z8_LOJA: "01",
      // Z8_VEND: "000001",
      // Z8_EMISSAO: "18/01/23",
      // Z8_COND: "001",
      // TOTAL: 10.54,
      // FATURADO: 0,
      // STATUS: "N",
      // QTDITEM: 1
    //}

    if (dispatch) {
      dispatch({ type: 'ADD_ORDER', payload: order })
      return
    }

    return order
  } catch (err) {
    toast('Falha ao obter o pedido')
    console.log(err)
  }
}

export const getOrderItems = async (orderNumber: string, store: Store): Promise <OrderItem[]> => {
  const {
    companyReducer: { state: { company }},
    orderReducer: { state: { orders }, dispatch },
  } = store


  const orderItemsRequest: OrderDetailRequest = {
    FILIAL: company.FILIAL?? '01',
    NUMERO: orderNumber
  }

  dispatch({ type: 'SET_LOADING', payload: { orderItems: true } })
  try {
    const response = await api.post('/COLETAITEMPEDIDO', orderItemsRequest)
    api.handleResponse(response)

    const orderItems: OrderItem[] = response.data.dados

    const foundOrderIndex = orders.findIndex(findingOrder => findingOrder.Z8_NUM === orderNumber)
    
    if (foundOrderIndex > -1) {
      const updatingOrders = [ ...orders ]
      updatingOrders[foundOrderIndex].items = orderItems
      
      dispatch({ type: 'SET_ORDERS', payload: updatingOrders })
    }
    
    dispatch({ type: 'SET_LOADING', payload: { orderItems: false } })
    return orderItems

  } catch (err) {
    console.log(err)
    toast('Falha ao obter os itens do pedido')
    return []
  }
}

export const getOrdersItems = async (customer: Customer, company: Company, dispatch: Dispatch<OrderStateActions>): Promise<OrderItem[] | void> => {
  const ordersItemsRequest = {
    FILIAL: company?.FILIAL ?? '01',
    LOJA: '01',
    CLIENTE: customer.A1_COD
  }

  dispatch({ type: 'SET_LOADING', payload: { ordersItems: true } })
  try {
    const response = await api.post('/COLETAITEMPEDIDO', ordersItemsRequest)
    api.handleResponse(response)

    const orderItems: OrderItem[] = response.data.dados

    // const orderItems: OrderItem[] = [
    //   {
    //     C6_FILIAL: '01',
    //     C6_ITEM: '01',
    //     C6_PRODUTO: '101101',
    //     C6_DESCRI: 'Produto 1',
    //     C6_UM: 'PC',
    //     C6_QTDVEN: 2,
    //     C6_PRCVEN: 413.05,
    //     C6_VALOR: 826.1,
    //     C6_TES: '530',
    //     C6_LOCAL: '01',
    //     C6_QTDENT: 2,
    //     C6_VALDESC: 0,
    //     C6_ENTREG: '04/10/22',
    //     C6_NUM: '000932',
    //     C6_PRUNIT: 413.05,
    //     ESTOQUE: 0
    //   },
    //   {
    //     C6_FILIAL: '01',
    //     C6_ITEM: '01',
    //     C6_PRODUTO: '101101',
    //     C6_DESCRI: 'Produto 1',
    //     C6_UM: 'PC',
    //     C6_QTDVEN: 2,
    //     C6_PRCVEN: 413.05,
    //     C6_VALOR: 826.1,
    //     C6_TES: '530',
    //     C6_LOCAL: '01',
    //     C6_QTDENT: 2,
    //     C6_VALDESC: 0,
    //     C6_ENTREG: '04/10/22',
    //     C6_NUM: '000933',
    //     C6_PRUNIT: 413.05,
    //     ESTOQUE: 0
    //   },
    //   {
    //     C6_FILIAL: '01',
    //     C6_ITEM: '01',
    //     C6_PRODUTO: '101102',
    //     C6_DESCRI: 'Produto 2',
    //     C6_UM: 'PC',
    //     C6_QTDVEN: 2,
    //     C6_PRCVEN: 413,
    //     C6_VALOR: 826,
    //     C6_TES: '530',
    //     C6_LOCAL: '01',
    //     C6_QTDENT: 2,
    //     C6_VALDESC: 0,
    //     C6_ENTREG: '04/10/22',
    //     C6_NUM: '000933',
    //     C6_PRUNIT: 413,
    //     ESTOQUE: 0
    //   },
    //   {
    //     C6_FILIAL: '01',
    //     C6_ITEM: '02',
    //     C6_PRODUTO: '103550',
    //     C6_DESCRI: 'Produto 3',
    //     C6_UM: 'PC',
    //     C6_QTDVEN: 2,
    //     C6_PRCVEN: 500.0,
    //     C6_VALOR: 900.0,
    //     C6_TES: '530',
    //     C6_LOCAL: '01',
    //     C6_QTDENT: 2,
    //     C6_VALDESC: 0,
    //     C6_ENTREG: '04/10/22',
    //     C6_NUM: '000934',
    //     C6_PRUNIT: 500.00,
    //     ESTOQUE: 10
    //   },
    //   {
    //     C6_FILIAL: '01',
    //     C6_ITEM: '02',
    //     C6_PRODUTO: '103551',
    //     C6_DESCRI: 'Produto 4',
    //     C6_UM: 'PC',
    //     C6_QTDVEN: 2,
    //     C6_PRCVEN: 500.0,
    //     C6_VALOR: 900.0,
    //     C6_TES: '530',
    //     C6_LOCAL: '01',
    //     C6_QTDENT: 2,
    //     C6_VALDESC: 0,
    //     C6_ENTREG: '04/10/22',
    //     C6_NUM: '000935',
    //     C6_PRUNIT: 900.00,
    //     ESTOQUE: 10
    //   },
    //   {
    //     C6_FILIAL: '01',
    //     C6_ITEM: '02',
    //     C6_PRODUTO: '103552',
    //     C6_DESCRI: 'Produto 5',
    //     C6_UM: 'PC',
    //     C6_QTDVEN: 5,
    //     C6_PRCVEN: 500.0,
    //     C6_VALOR: 900.0,
    //     C6_TES: '530',
    //     C6_LOCAL: '01',
    //     C6_QTDENT: 2,
    //     C6_VALDESC: 0,
    //     C6_ENTREG: '04/10/22',
    //     C6_NUM: '000936',
    //     C6_PRUNIT: 300.00,
    //     ESTOQUE: 10
    //   },
    //   {
    //     C6_FILIAL: '01',
    //     C6_ITEM: '02',
    //     C6_PRODUTO: '103553',
    //     C6_DESCRI: 'Produto 6',
    //     C6_UM: 'PC',
    //     C6_QTDVEN: 1,
    //     C6_PRCVEN: 500.0,
    //     C6_VALOR: 900.0,
    //     C6_TES: '530',
    //     C6_LOCAL: '01',
    //     C6_QTDENT: 2,
    //     C6_VALDESC: 0,
    //     C6_ENTREG: '04/10/22',
    //     C6_NUM: '000937',
    //     C6_PRUNIT: 200.00,
    //     ESTOQUE: 10
    //   },
    //   {
    //     C6_FILIAL: '01',
    //     C6_ITEM: '01',
    //     C6_PRODUTO: '101101',
    //     C6_DESCRI: 'Produto 1',
    //     C6_UM: 'PC',
    //     C6_QTDVEN: 2,
    //     C6_PRCVEN: 413.05,
    //     C6_VALOR: 826.1,
    //     C6_TES: '530',
    //     C6_LOCAL: '01',
    //     C6_QTDENT: 2,
    //     C6_VALDESC: 0,
    //     C6_ENTREG: '04/10/22',
    //     C6_NUM: '000938',
    //     C6_PRUNIT: 413.05,
    //     ESTOQUE: 0
    //   },
    //   {
    //     C6_FILIAL: '01',
    //     C6_ITEM: '01',
    //     C6_PRODUTO: '101101',
    //     C6_DESCRI: 'Produto 1',
    //     C6_UM: 'PC',
    //     C6_QTDVEN: 2,
    //     C6_PRCVEN: 413.05,
    //     C6_VALOR: 826.1,
    //     C6_TES: '530',
    //     C6_LOCAL: '01',
    //     C6_QTDENT: 2,
    //     C6_VALDESC: 0,
    //     C6_ENTREG: '04/10/22',
    //     C6_NUM: '000939',
    //     C6_PRUNIT: 413.05,
    //     ESTOQUE: 0
    //   },
    //   {
    //     C6_FILIAL: '01',
    //     C6_ITEM: '01',
    //     C6_PRODUTO: '101101',
    //     C6_DESCRI: 'Produto 1',
    //     C6_UM: 'PC',
    //     C6_QTDVEN: 2,
    //     C6_PRCVEN: 413.05,
    //     C6_VALOR: 826.1,
    //     C6_TES: '530',
    //     C6_LOCAL: '01',
    //     C6_QTDENT: 2,
    //     C6_VALDESC: 0,
    //     C6_ENTREG: '04/10/22',
    //     C6_NUM: '000940',
    //     C6_PRUNIT: 413.05,
    //     ESTOQUE: 0
    //   },
    // ]

    dispatch({ type: 'SET_LOADING', payload: { orderItems: false } })
    return orderItems

  } catch (err) {
    console.log(err)
    toast('Falha ao obter os itens do pedido')
    return []
  }
}

export const setOrdersItems = (orders: Order[], ordersItems: OrderItem[], dispatch: Dispatch<OrderStateActions>): void => {
  if (!orders) 
    return 
  const updatingOrders = [ ...orders ]

  ordersItems?.forEach(orderItem => {
    const foundOrderIndex = orders.findIndex(findingOrder => findingOrder.Z8_NUM === orderItem.Z9_NUM)
    
    if (foundOrderIndex === -1) {
      console.log(`Order with number ${orderItem.Z9_NUM} not found for item adding!`)
      return
    }
    
    updatingOrders[foundOrderIndex].items = [ ...updatingOrders[foundOrderIndex].items || [], orderItem ]
  })

  dispatch({ type: 'SET_ORDERS', payload: updatingOrders })
}

export const createOrder = async (order: Order, store: Store): Promise<any> => {
  const {
    companyReducer: { state: { company }},
    customerReducer: { state: { customer }},
    orderReducer: { dispatch },
  } = store

  const orderRequest: OrderCRUDRequest = {
    FILIAL: company.FILIAL?? '01',
    CABEC: {
      Z8_TIPO: 'N',
      Z8_TPFRETE: 'CIF',
      Z8_CLIENTE: customer.A1_COD,
      Z8_LOJA: '01',
      Z8_COND: order.Z8_COND, 
      Z8_STATUS: 'A',
      Z8_DESC: 0,
      Z8_VEND: customer.A1_COD,
      Z8_TOTAL: getOrderAmount(order.items!),
      Z8_EMISSAO: formatDateToApiRequest(order.Z8_EMISSAO),
    },
    ITEM: generateOrderRequestItems(order.items)
  }
  
  try {
    const response = await api.post('/INSEREPEDIDO', orderRequest)
    api.handleResponse(response)

    dispatch({ type: 'RESET_ORDER' }) 

    getOrderByID(response.data.dados[0].Z8_NUM, company, store)
  } catch (err) {
    console.log(err)
    toast('Falha ao criar do pedido')
  }
}

export const updateOrder = async (order: Order, store: Store) => {
  const {
    companyReducer: { state: { company }},
    orderReducer: { state: { orders }, dispatch },
  } = store

  const orderUpdateRequest: OrderCRUDRequest = {
    FILIAL: company.FILIAL?? '01',
    CABEC: {
      Z8_TIPO: order.Z8_TIPO,
      Z8_TPFRETE: order.Z8_TPFRETE,
      Z8_CLIENTE: order.Z8_CLIENTE,
      Z8_LOJA: '01',
      Z8_COND: order.Z8_COND, 
      Z8_STATUS: 'A',
      Z8_DESC: 0,
      Z8_TOTAL: getOrderAmount(order.items!),
      Z8_EMISSAO: formatDateToApiRequest(order.Z8_EMISSAO),
    },
    ITEM: generateOrderRequestItems(order.items)
  }

  try {
    const response = await api.post('/ALTERAPEDIDO', orderUpdateRequest)
    api.handleResponse(response)

    const foundOrderIndex = orders.findIndex(findingOrder => findingOrder.Z8_NUM === order.Z8_NUM)

    if (foundOrderIndex > -1) {
      const updatingOrders = [ ...orders ]
    
      updatingOrders[foundOrderIndex] = order
      dispatch({ type: 'SET_ORDERS', payload: updatingOrders })
    }
  } catch (err) {
    console.log(err)
    toast('Falha ao criar do pedido')
  } 
}

export const removeOrder = async (orderPosition: number, store: Store): Promise<void> => {
  const {
    companyReducer: { state: { company }},
    orderReducer: { state: { orders }, dispatch },
  } = store

  if (parseInt(orders[orderPosition].STATUS) > 5) {
    toast('Não é possível excluir um pedido após ter sido faturado')
    return
  }

  const order = orders[orderPosition]

  const orderRemoveRequest = {
    FILIAL: company.FILIAL?? '01',
    CABEC: { Z8_NUM: order.Z8_NUM },
    ITEM: Array.from(
      { length: order.QTDITEM }, 
      (_, key) => ({ Z9_ITEM: `${(key + 1) < 10 ? '0' : ''}${key + 1}` })
    )
  }

  try {
    const response = await api.post('/EXCLUIPEDIDO', orderRemoveRequest)
    api.handleResponse(response)

    dispatch({ 
      type: 'SET_ORDERS', 
      payload: [ ...orders.slice(0, orderPosition), ...orders.slice(orderPosition + 1) ] 
    })

    toast(`Pedido Nº ${order.Z8_NUM} excluido com sucesso`)

  } catch (err) {
    console.log(err)
    toast('Falha ao remover pedido')
  } 
}

export const getOrderPaymentMethods = async (dispatch: Dispatch<OrderStateActions>): Promise<void> => {
  try {
    console.log('passou aqui');
    const response = await api.get('/COLETACONDICAO')
    //const response = responseColetaCondicaoMock
    api.handleResponse(response)

    // const response = {
    //   data: {
    //     dados: [
    //       { E4_CODIGO: '001', E4_COND: '1', E4_DESCRI: 'CRED BANCARIO' },
    //       { E4_CODIGO: '002', E4_COND: '02', E4_DESCRI: 'BB - 2 DIAS' },
    //       { E4_CODIGO: 'TRF', E4_COND: '99', E4_DESCRI: 'TRANSF BANCARIA' }
    //     ] as OrderPaymentMethod[]
    //   }
    // }


    dispatch({ type: 'SET_ORDER_PAYMENT_METHODS', payload: response.data?.dados })

  } catch (err) {
    console.log(err)
    toast('Falha ao obter formas de pagamento para pedido')
  } 
} 

export const getOrderTaxes = async (orderPosition: number, store: Store) => {
  const {
    companyReducer: { state: { company }},
    orderReducer: { state: { orders }, dispatch },
  } = store

  const order = orders[orderPosition]

  const orderTaxRequest: OrderDetailRequest = {
    FILIAL: company.FILIAL?? '01',
    NUMERO: order.Z8_NUM!
  }

  try {
    const response = await api.post('/COLETAIMPOSTO', orderTaxRequest)
    api.handleResponse(response)

    // const response = {
    //   data: {
    //     dados: [
    //       { CODIGO: 'ICM', E4_COND: 'ICMS', BASE: 32.6, ALIQUOTA: 18, VALOR: 5.87 },
    //       { CODIGO: 'ICR', E4_COND: 'ICMS Retido', BASE: 8478.24, ALIQUOTA: 4, VALOR: 135.13 },
    //     ] as OrderTax[]
    //   }
    // }

    orders[orderPosition].taxes = response.data.dados

    dispatch({ type: 'SET_ORDERS', payload: orders })

  } catch (err) {
    console.log(err)
    toast(`Falha ao obter impostos do pedido nº ${order.Z8_NUM}`)
  } 
}

export const getOrderXML = async (order: Order, store: Store): Promise<any> => {
  const { 
    orderReducer: { dispatch },
    companyReducer: { state: { company }} 
  } = store

  const orderTaxRequest: OrderDetailRequest = {
    FILIAL: company.FILIAL?? '01',
    NUMERO: order.Z8_NUM!
  }

  dispatch({ type: 'SET_LOADING', payload: { order: `${order.Z8_NUM!}XML` }})
  try {
    const response = await api.post('/COLETAXML', orderTaxRequest).then(r => api.handleResponse(r))
    const filename = response.data?.dados[0].ARQUIVO
    // const filename = '010001534341.XML';
    const filecontent = await api.downloadFile(filename).then(r => r.data)

    if (!filecontent)
      throw new Error('Failed to retrieve file content')

    dispatch({ type: 'SET_LOADING', payload: { order: '' }})
    return {name: filename, content: filecontent}

  } catch (err) {
    console.log(err)
    toast(`Falha ao obter o XML: ${err}`)
  }
  dispatch({ type: 'SET_LOADING', payload: { order: '' }})
}

export const getOrderNFE = async (order: Order, store: Store): Promise<any> => {
  const { 
    orderReducer: { dispatch },
    companyReducer: { state: { company }} 
  } = store

  const orderTaxRequest: OrderDetailRequest = {
    FILIAL: company.FILIAL?? '01',
    NUMERO: order.Z8_NUM!
  }

  dispatch({ type: 'SET_LOADING', payload: { order: `${order.Z8_NUM!}NFE` }})
  try {
    const response = await api.post('/COLETADANFE', orderTaxRequest).then(r => api.handleResponse(r))
    const filename = response.data?.dados[0].ARQUIVO
    const filecontent = await api.downloadFile(filename).then(r => r.data)

    if (!filecontent)
      throw new Error('Failed to retrieve filename')

    dispatch({ type: 'SET_LOADING', payload: { order: '' }})
    return {name: filename, content: filecontent}

  } catch (err) {
    console.log(err)
    toast(`Falha ao obter o PDF da NFE: ${err}`)
  }
  dispatch({ type: 'SET_LOADING', payload: { order: '' }})
}

export const verifyOrderTaxes = async (order: Order, store: Store, orderPosition: number) => {
  if (!order.taxes?.length) 
    await getOrderTaxes(orderPosition, store)
}

const generateOrderRequestItems = (orderItems: OrderItem[] = []): any => 
  orderItems.map(({ Z9_ITEM, Z9_VUNIT, Z9_PRODUTO, Z9_QUANT, AUTDELETA }) => ({ Z9_ITEM, Z9_VUNIT, Z9_PRODUTO, Z9_QUANT, AUTDELETA })) 

const getOrderAmount = (items: OrderItem[]) => items.reduce((acc: number, { Z9_QUANT, Z9_VUNIT }: OrderItem) => acc + Z9_QUANT * Z9_VUNIT, 0)

interface _ProductReport {
  id: string
  description: string
  quantity: number
  total: number
}

export const getOrderStatusReportByProducts = (order: Order[]): any => {
  let reportData: _ProductReport[] = [];
  const allOrderItens = order.map(x => x.items);
  allOrderItens.forEach(function(itemArray) {
    itemArray?.forEach(function(product) {
      const index = reportData.map(function(e) { return e.id }).indexOf(product.Z9_PRODUTO ?? '');
      if(index == -1) {
        reportData.push( {
          id: product.Z9_PRODUTO ?? '',
          description: product.Z9_DESCR ?? '',
          quantity: 1,
           total: product.Z9_TOTAL
        })
      }
      else {
        reportData[index].quantity++
        reportData[index].total += product.Z9_TOTAL
      }
    })
  })
  return reportData.sort(function(a, b) { return b.total - a.total })
}

export const getTotalOrderValue = (orders: Order[]): number => {
  let totalOrderValue = 0

  for (const order of orders) 
    totalOrderValue += order.TOTAL
  
  return totalOrderValue
}

export const generateOrderStatusReport = (orders: Order[] = []): any => ({
  open: orders.filter(order => order.STATUS === 'A').length,
  released: orders.filter(order => order.STATUS === 'L').length,
  comercialReleased: orders.filter(order => order.STATUS === 'B').length,
  financialReleased: orders.filter(order => order.STATUS === 'F').length,
  partialEffective: orders.filter(order => order.STATUS === 'M').length,
  effective: orders.filter(order => order.STATUS === 'E').length,
  partialBilled: orders.filter(order => order.STATUS === 'P').length,
  billed: orders.filter(order => order.STATUS === 'O').length,
  denied: orders.filter(order => order.STATUS === 'N').length,
  canceled: orders.filter(order => order.STATUS === 'C').length,
})

export const filterOrdersByPeriod = (period: number, orders: Order[]): Order[] => {
  if (period === -1) 
    return orders

  const initialDate = new Date()
  initialDate.setDate(initialDate.getDate() - period);
  initialDate.setHours(0, 0, 0, 0);

  return orders.filter(order => {
    const splittedOrderDate = order.Z8_EMISSAO.split('/')
    const normalizedOrderDate = new Date(`${splittedOrderDate[1]}/${splittedOrderDate[0]}/${splittedOrderDate[2]}`)
    normalizedOrderDate.setHours(0, 0, 0, 0);

    return initialDate.getTime() <= normalizedOrderDate.getTime() 
  })
}

export const getOrdersBestSellers = (orders: Order[], limit?: number): any[] => {
  const orderItems = orders
    .map(({ items = [] }) => items)
    .flat()
    
  const report: any = []

  for (const orderItem of orderItems) {
    const foundItemIndex = report.findIndex((findingReport: any) => findingReport.Z9_PRODUTO === orderItem.Z9_PRODUTO)

    if (foundItemIndex === -1) {
      report.push({ 
        Z9_PRODUTO: orderItem.Z9_PRODUTO,
        Z9_DESCR: orderItem.Z9_DESCR,
        Z9_QUANT: orderItem.Z9_QUANT
      })
      continue
    }

    report[foundItemIndex].Z9_QUANT += orderItem.Z9_QUANT
  }

  report.sort((a: any, b: any) => b.Z9_QUANT - a.Z9_QUANT)

  if (limit && limit > 0)
    return report.filter((_: any, i: any) => i >= report.length - limit)
    
  return report
}

export const getOrderCountByMonth = (orders: Order[]) => {
  const orderCountByYearMonths = Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => i + 1).map(month => {
      const monthStr = month < 10 ? `0${month}` : `${month}`
      return [monthStr, 0]
    })
  )

  orders.forEach( ({ Z8_EMISSAO }) => {
    const orderCreationMonth = Z8_EMISSAO.split('/')[1]
    orderCountByYearMonths[orderCreationMonth]++
  })

  return orderCountByYearMonths
}

export const getOrdersValueSumByMonth = (orders: Order[]) => {
  const orderCountByYearMonths = Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => i + 1).map(month => {
      const monthStr = month < 10 ? `0${month}` : `${month}`
      return [monthStr, 0]
    })
  )

  orders.forEach( ({ Z8_EMISSAO, TOTAL }) => {
    const orderCreationMonth = Z8_EMISSAO.split('/')[1]
    orderCountByYearMonths[orderCreationMonth] += TOTAL
  })

  return orderCountByYearMonths
}


//const responseColetaCondicaoMock = { data: {"sucesso": "T","dados": [{"E4_CODIGO":"001","E4_COND":"1","E4_DESCRI":"CRED BANCARIO"},{"E4_CODIGO":"002","E4_COND":"02","E4_DESCRI":"BB - 2 DIAS"},{"E4_CODIGO":"003","E4_COND":"03","E4_DESCRI":"BB-03 DIAS"},{"E4_CODIGO":"004","E4_COND":"04","E4_DESCRI":"BB-04DIAS"},{"E4_CODIGO":"005","E4_COND":"05","E4_DESCRI":"BB-05 DIAS"},{"E4_CODIGO":"006","E4_COND":"06","E4_DESCRI":"BB-06 DIAS"},{"E4_CODIGO":"007","E4_COND":"07","E4_DESCRI":"BB-07 DIAS"},{"E4_CODIGO":"009","E4_COND":"09","E4_DESCRI":"BB-09 DIAS"},{"E4_CODIGO":"010","E4_COND":"10","E4_DESCRI":"BB-10 DIAS"},{"E4_CODIGO":"011","E4_COND":"11","E4_DESCRI":"BB-11 DIAS"},{"E4_CODIGO":"014","E4_COND":"14","E4_DESCRI":"BB-14DIAS"},{"E4_CODIGO":"015","E4_COND":"15","E4_DESCRI":"BB-15DIAS"},{"E4_CODIGO":"017","E4_COND":"17","E4_DESCRI":"BB-17 DIAS"},{"E4_CODIGO":"019","E4_COND":"19","E4_DESCRI":"BB -19 DIAS"},{"E4_CODIGO":"020","E4_COND":"20","E4_DESCRI":"BB - 20 DIAS"},{"E4_CODIGO":"021","E4_COND":"21","E4_DESCRI":"BB-21 DIAS"},{"E4_CODIGO":"025","E4_COND":"25","E4_DESCRI":"BB-25 DIAS"},{"E4_CODIGO":"027","E4_COND":"27","E4_DESCRI":"BB-27 DIAS"},{"E4_CODIGO":"028","E4_COND":"28","E4_DESCRI":"BB-28 DIAS"},{"E4_CODIGO":"030","E4_COND":"30","E4_DESCRI":"BB-30 DIAS"},{"E4_CODIGO":"031","E4_COND":"31","E4_DESCRI":"BB-31 DIAS"},{"E4_CODIGO":"032","E4_COND":"32","E4_DESCRI":"BB-32 DIAS"},{"E4_CODIGO":"033","E4_COND":"33","E4_DESCRI":"BB-33 DIAS"},{"E4_CODIGO":"035","E4_COND":"35","E4_DESCRI":"BB-35 DIAS"},{"E4_CODIGO":"037","E4_COND":"37","E4_DESCRI":"BB-37 DIAS"},{"E4_CODIGO":"038","E4_COND":"38","E4_DESCRI":"BB-38 DIAS"},{"E4_CODIGO":"041","E4_COND":"40","E4_DESCRI":"BB-40 DIAS"},{"E4_CODIGO":"042","E4_COND":"42","E4_DESCRI":"BB-42 DIAS"},{"E4_CODIGO":"045","E4_COND":"45","E4_DESCRI":"BB-45 DIAS"},{"E4_CODIGO":"049","E4_COND":"49","E4_DESCRI":"BB-49 DIAS"},{"E4_CODIGO":"056","E4_COND":"56","E4_DESCRI":"BB-56 DIAS"},{"E4_CODIGO":"060","E4_COND":"60","E4_DESCRI":"BB-60 DIAS"},{"E4_CODIGO":"061","E4_COND":"120","E4_DESCRI":"BB-120 DIAS"},{"E4_CODIGO":"062","E4_COND":"180","E4_DESCRI":"BB-180 DIAS"},{"E4_CODIGO":"063","E4_COND":"360","E4_DESCRI":"BB-360 DIAS"},{"E4_CODIGO":"077","E4_COND":"77","E4_DESCRI":"BB-77 DIAS"},{"E4_CODIGO":"100","E4_COND":"30","E4_DESCRI":"CC - BNDES"},{"E4_CODIGO":"101","E4_COND":"30","E4_DESCRI":"CH-TELECHEQUE 1"},{"E4_CODIGO":"102","E4_COND":"30,60","E4_DESCRI":"CH-TELECHEQUE 2"},{"E4_CODIGO":"103","E4_COND":"30,60,90","E4_DESCRI":"CH-TELECHEQUE 3"},{"E4_CODIGO":"104","E4_COND":"30,60,90,120","E4_DESCRI":"CH-TELECHEQUE 4"},{"E4_CODIGO":"105","E4_COND":"30,60,90,120,150","E4_DESCRI":"CH-TELECHEQUE 5"},{"E4_CODIGO":"106","E4_COND":"30,60,90,120,150,180","E4_DESCRI":"CH-TELECHEQUE 6"},{"E4_CODIGO":"107","E4_COND":"1","E4_DESCRI":"CH-TELECHEQUE 0"},{"E4_CODIGO":"108","E4_COND":"30","E4_DESCRI":"CC - PRIME"},{"E4_CODIGO":"109","E4_COND":"42","E4_DESCRI":"CC - TICKET LOG"},{"E4_CODIGO":"110","E4_COND":"30,60,90,120,150,180,210,240,270,300","E4_DESCRI":"CC - ELO 10X"},{"E4_CODIGO":"111","E4_COND":"30","E4_DESCRI":"CC - ELO 1X"},{"E4_CODIGO":"112","E4_COND":"30,60","E4_DESCRI":"CC - ELO 2X"},{"E4_CODIGO":"113","E4_COND":"30,60,90","E4_DESCRI":"CC - ELO 3X"},{"E4_CODIGO":"114","E4_COND":"30,60,90,120","E4_DESCRI":"CC - ELO 4X"},{"E4_CODIGO":"115","E4_COND":"30,60,90,120,150","E4_DESCRI":"CC - ELO 5X"},{"E4_CODIGO":"116","E4_COND":"30,60,90,120,150,180","E4_DESCRI":"CC - ELO 6X"},{"E4_CODIGO":"117","E4_COND":"30,60,90,120,150,180,210","E4_DESCRI":"CC - ELO 7X"},{"E4_CODIGO":"118","E4_COND":"30,60,90,120,150,180,210,240","E4_DESCRI":"CC - ELO 8X"},{"E4_CODIGO":"119","E4_COND":"30,60,90,120,150,180,210,240,270","E4_DESCRI":"CC - ELO 9X"},{"E4_CODIGO":"120","E4_COND":"2","E4_DESCRI":"CD - ELO"},{"E4_CODIGO":"121","E4_COND":"30","E4_DESCRI":"CC - AMEX 1X"},{"E4_CODIGO":"122","E4_COND":"30,60","E4_DESCRI":"CC - AMEX 2X"},{"E4_CODIGO":"123","E4_COND":"30,60,90","E4_DESCRI":"CC - AMEX 3X"},{"E4_CODIGO":"124","E4_COND":"30,60,90,120","E4_DESCRI":"CC - AMEX 4X"},{"E4_CODIGO":"125","E4_COND":"30,60,90,120,150","E4_DESCRI":"CC - AMEX 5X"},{"E4_CODIGO":"126","E4_COND":"30,60,90,120,150,180","E4_DESCRI":"CC - AMEX 6X"},{"E4_CODIGO":"127","E4_COND":"30,60,90,120,150,180,210","E4_DESCRI":"CC - AMEX 7X"},{"E4_CODIGO":"128","E4_COND":"30,60,90,120,150,180,210,240","E4_DESCRI":"CC - AMEX 8X"},{"E4_CODIGO":"129","E4_COND":"30,60,90,120,150,180,210,240,270","E4_DESCRI":"CC - AMEX 9X"},{"E4_CODIGO":"130","E4_COND":"30,60,90,120,150,180,210,240,270,300","E4_DESCRI":"CC - AMEX 10X"},{"E4_CODIGO":"140","E4_COND":"30,60,90,120,150,180,210,240,270,300","E4_DESCRI":"CC-HIPERCARD 10"},{"E4_CODIGO":"141","E4_COND":"30","E4_DESCRI":"CC-HIPERCARD 1X"},{"E4_CODIGO":"142","E4_COND":"30,60","E4_DESCRI":"CC-HIPERCARD 2X"},{"E4_CODIGO":"143","E4_COND":"30,60,90","E4_DESCRI":"CC-HIPERCARD 3X"},{"E4_CODIGO":"144","E4_COND":"30,60,90,120","E4_DESCRI":"CC-HIPERCARD 4X"},{"E4_CODIGO":"145","E4_COND":"30,60,90,120,150","E4_DESCRI":"CC-HIPERCARD 5X"},{"E4_CODIGO":"146","E4_COND":"30,60,90,120,150,180","E4_DESCRI":"CC-HIPERCARD 6X"},{"E4_CODIGO":"147","E4_COND":"30,60,90,120,150,180,210","E4_DESCRI":"CC-HIPERCARD 7X"},{"E4_CODIGO":"148","E4_COND":"30,60,90,120,150,180,210,240","E4_DESCRI":"CC-HIPERCARD 8X"},{"E4_CODIGO":"149","E4_COND":"30,60,90,120,150,180,210,240,270","E4_DESCRI":"CC-HIPERCARD 9X"},{"E4_CODIGO":"150","E4_COND":"30,60,90,120,150,180,210,240,270,300","E4_DESCRI":"CC - VISA 10X"},{"E4_CODIGO":"151","E4_COND":"30","E4_DESCRI":"CC - VISA 1X"},{"E4_CODIGO":"152","E4_COND":"30,60","E4_DESCRI":"CC - VISA 2X"},{"E4_CODIGO":"153","E4_COND":"30,60,90","E4_DESCRI":"CC - VISA 3X"},{"E4_CODIGO":"154","E4_COND":"30,60,90,120","E4_DESCRI":"CC - VISA 4X"},{"E4_CODIGO":"155","E4_COND":"30,60,90,120,150","E4_DESCRI":"CC - VISA 5X"},{"E4_CODIGO":"156","E4_COND":"30,60,90,120,150,180","E4_DESCRI":"CC - VISA 6X"},{"E4_CODIGO":"157","E4_COND":"30,60,90,120,150,180,210","E4_DESCRI":"CC - VISA 7X"},{"E4_CODIGO":"158","E4_COND":"30,60,90,120,150,180,210,240","E4_DESCRI":"CC - VISA 8X"},{"E4_CODIGO":"159","E4_COND":"30,60,90,120,150,180,210,240,270","E4_DESCRI":"CC - VISA 9X"},{"E4_CODIGO":"160","E4_COND":"2","E4_DESCRI":"CD - MAESTRO"},{"E4_CODIGO":"165","E4_COND":"45","E4_DESCRI":"CC - VALECARD"},{"E4_CODIGO":"170","E4_COND":"30,60,90,120,150,180,210,240,270,300","E4_DESCRI":"CC - DINNERS 10"},{"E4_CODIGO":"171","E4_COND":"30","E4_DESCRI":"CC - DINNERS 1X"},{"E4_CODIGO":"172","E4_COND":"30,60","E4_DESCRI":"CC - DINNERS 2X"},{"E4_CODIGO":"173","E4_COND":"30,60,90","E4_DESCRI":"CC - DINNERS 3X"},{"E4_CODIGO":"174","E4_COND":"30,60,90,120","E4_DESCRI":"CC - DINNERS 4X"},{"E4_CODIGO":"175","E4_COND":"30,60,90,120,150","E4_DESCRI":"CC - DINNERS 5X"},{"E4_CODIGO":"176","E4_COND":"30,60,90,120,150,180","E4_DESCRI":"CC - DINNERS 6X"},{"E4_CODIGO":"177","E4_COND":"30,60,90,120,150,180,210","E4_DESCRI":"CC - DINNERS 7X"},{"E4_CODIGO":"178","E4_COND":"30,60,90,120,150,180,210,240","E4_DESCRI":"CC - DINNERS 8X"},{"E4_CODIGO":"179","E4_COND":"30,60,90,120,150,180,210,240,270","E4_DESCRI":"CC - DINNERS 9X"},{"E4_CODIGO":"180","E4_COND":"30,60,90,120,150,180,210,240,270,300","E4_DESCRI":"CC-MASTER 10X"},{"E4_CODIGO":"181","E4_COND":"30","E4_DESCRI":"CC-MASTER 1X"},{"E4_CODIGO":"182","E4_COND":"30,60","E4_DESCRI":"CC- MASTER 2X"},{"E4_CODIGO":"183","E4_COND":"30,60,90","E4_DESCRI":"CC-MASTER 3X"},{"E4_CODIGO":"184","E4_COND":"30,60,90,120","E4_DESCRI":"CC-MASTER 4X"},{"E4_CODIGO":"185","E4_COND":"30,60,90,120,150","E4_DESCRI":"CC-MASTER 5X"},{"E4_CODIGO":"186","E4_COND":"30,60,90,120,150,180","E4_DESCRI":"CC-MASTER 6X"},{"E4_CODIGO":"187","E4_COND":"30,60,90,120,150,180,210","E4_DESCRI":"CC-MASTER 7X"},{"E4_CODIGO":"188","E4_COND":"30,60,90,120,150,180,210,240","E4_DESCRI":"CC-MASTER 8X"},{"E4_CODIGO":"189","E4_COND":"30,60,90,120,150,180,210,240,270","E4_DESCRI":"CC-MASTER 9X"},{"E4_CODIGO":"190","E4_COND":"2","E4_DESCRI":"CD-VISA ELEC"},{"E4_CODIGO":"201","E4_COND":"30,60","E4_DESCRI":"BB-30/60 DIAS"},{"E4_CODIGO":"202","E4_COND":"21,42","E4_DESCRI":"BB-21/42 DIAS"},{"E4_CODIGO":"203","E4_COND":"14,28","E4_DESCRI":"BB-14/28 DIAS"},{"E4_CODIGO":"204","E4_COND":"07,14","E4_DESCRI":"BB-07/14 DIAS"},{"E4_CODIGO":"205","E4_COND":"07,28","E4_DESCRI":"BO-07/28"},{"E4_CODIGO":"206","E4_COND":"14,21","E4_DESCRI":"BB-14/21"},{"E4_CODIGO":"207","E4_COND":"25,50","E4_DESCRI":"BB-25/50"},{"E4_CODIGO":"208","E4_COND":"10,20","E4_DESCRI":"BB-10/20"},{"E4_CODIGO":"209","E4_COND":"15,30","E4_DESCRI":"BB-15/30"},{"E4_CODIGO":"210","E4_COND":"28,42","E4_DESCRI":"BB-28/42"},{"E4_CODIGO":"211","E4_COND":"05,15","E4_DESCRI":"BB-05/15"},{"E4_CODIGO":"212","E4_COND":"30,59","E4_DESCRI":"BB-30/59 DIAS"},{"E4_CODIGO":"213","E4_COND":"20,40","E4_DESCRI":"BB-20/40 DIAS"},{"E4_CODIGO":"216","E4_COND":"28,56","E4_DESCRI":"BB-28/56 DIAS"},{"E4_CODIGO":"217","E4_COND":"28,35","E4_DESCRI":"BB-28/35 DIAS"},{"E4_CODIGO":"218","E4_COND":"35,49","E4_DESCRI":"BB-35/49 DIAS"},{"E4_CODIGO":"219","E4_COND":"29,59","E4_DESCRI":"BB-29/59 DIAS"},{"E4_CODIGO":"302","E4_COND":"14,28,42","E4_DESCRI":"BB-14/28/42"},{"E4_CODIGO":"303","E4_COND":"30,60,90","E4_DESCRI":"BB-30/60/90"},{"E4_CODIGO":"304","E4_COND":"07,14,28","E4_DESCRI":"BB-07/14/28"},{"E4_CODIGO":"305","E4_COND":"25,50,75","E4_DESCRI":"BB-25/50/75"},{"E4_CODIGO":"306","E4_COND":"07,14,21","E4_DESCRI":"BB-7/14/21"},{"E4_CODIGO":"307","E4_COND":"21,28,35","E4_DESCRI":"BB-21/28/35"},{"E4_CODIGO":"308","E4_COND":"14,21,28","E4_DESCRI":"BB-14/21/28"},{"E4_CODIGO":"309","E4_COND":"1,20,40","E4_DESCRI":"BB-1/20/40"},{"E4_CODIGO":"310","E4_COND":"28,35,42","E4_DESCRI":"BB-28/35/42"},{"E4_CODIGO":"311","E4_COND":"42,56,70","E4_DESCRI":"BB-42/56/70"},{"E4_CODIGO":"312","E4_COND":"14,28,56","E4_DESCRI":"BB-14/28/56"},{"E4_CODIGO":"313","E4_COND":"28,42,56","E4_DESCRI":"BB-28/42/56"},{"E4_CODIGO":"319","E4_COND":"28,56,84","E4_DESCRI":"BB-28/56/84"},{"E4_CODIGO":"320","E4_COND":"31,63,94","E4_DESCRI":"BB-31/63/94"},{"E4_CODIGO":"321","E4_COND":"10,20,30","E4_DESCRI":"BB-10/20/30"},{"E4_CODIGO":"322","E4_COND":"21,42,63","E4_DESCRI":"BB-21/42/63"},{"E4_CODIGO":"323","E4_COND":"30,45,60","E4_DESCRI":"BB-30/45/60"},{"E4_CODIGO":"324","E4_COND":"21,35,49","E4_DESCRI":"BB-21/35/49"},{"E4_CODIGO":"325","E4_COND":"42,56,84","E4_DESCRI":"BB-42/56/84"},{"E4_CODIGO":"326","E4_COND":"42,63,105","E4_DESCRI":"BB-42/63/105"},{"E4_CODIGO":"327","E4_COND":"29,57,85","E4_DESCRI":"BB- 29/57/85"},{"E4_CODIGO":"328","E4_COND":"29,64,92","E4_DESCRI":"BB-26/64/92 D"},{"E4_CODIGO":"329","E4_COND":"28,35,42","E4_DESCRI":"BB-28/35/42 D"},{"E4_CODIGO":"330","E4_COND":"30,58,86","E4_DESCRI":"BB-30/58/86"},{"E4_CODIGO":"331","E4_COND":"28,35,42","E4_DESCRI":"BB-28/35/42"},{"E4_CODIGO":"401","E4_COND":"28,56,84,112","E4_DESCRI":"BB-28/56/84/112"},{"E4_CODIGO":"402","E4_COND":"14,28,42,56","E4_DESCRI":"BB-14/28/42/56"},{"E4_CODIGO":"403","E4_COND":"28,56,84,98","E4_DESCRI":"BB-28/56/84/98"},{"E4_CODIGO":"404","E4_COND":"21,42,63,84","E4_DESCRI":"BB-21/42/63/84"},{"E4_CODIGO":"405","E4_COND":"30,60,90,120","E4_DESCRI":"BB-30/60/90/120"},{"E4_CODIGO":"406","E4_COND":"04,18,32,46","E4_DESCRI":"BB-04/18/32/46"},{"E4_CODIGO":"407","E4_COND":"14,28,56,84","E4_DESCRI":"BB-14/28/56/84"},{"E4_CODIGO":"408","E4_COND":"20,40,60,80","E4_DESCRI":"BB -20/40/60/80"},{"E4_CODIGO":"409","E4_COND":"15,35,63,98","E4_DESCRI":"BB-15/35/63/98"},{"E4_CODIGO":"410","E4_COND":"10,20,30,40","E4_DESCRI":"BB-10/20/30/40"},{"E4_CODIGO":"411","E4_COND":"25,50,75,100","E4_DESCRI":"BB-25/50/75/100"},{"E4_CODIGO":"412","E4_COND":"7,14,21,35","E4_DESCRI":"BB-7/14/28/35"},{"E4_CODIGO":"413","E4_COND":"26,46,66,86","E4_DESCRI":"BB-26/46/66/86"},{"E4_CODIGO":"414","E4_COND":"10,20,30,40","E4_DESCRI":"BB-10/20/30/40"},{"E4_CODIGO":"415","E4_COND":"7,14,21,28","E4_DESCRI":"BB-7/14/21/28"},{"E4_CODIGO":"416","E4_COND":"14,28,56,72","E4_DESCRI":"BB-14/28/56/72"},{"E4_CODIGO":"417","E4_COND":"21,35,49,63","E4_DESCRI":"BB-21/35/49/63"},{"E4_CODIGO":"418","E4_COND":"14,21,28,35","E4_DESCRI":"BB-14/21/28/35"},{"E4_CODIGO":"419","E4_COND":"40,50,70,90","E4_DESCRI":"BB-40/50/70/90"},{"E4_CODIGO":"420","E4_COND":"14,28,35,42","E4_DESCRI":"BB-14/28/35/42"},{"E4_CODIGO":"421","E4_COND":"14,21,35,42","E4_DESCRI":"BB-14/21/35/42"},{"E4_CODIGO":"422","E4_COND":"03,28,56,84","E4_DESCRI":"BB-03/28/56/84"},{"E4_CODIGO":"423","E4_COND":"32,62,92,122","E4_DESCRI":"BB-32/62/92/122"},{"E4_CODIGO":"424","E4_COND":"7,28,56,84","E4_DESCRI":"BB-7/28/56/84"},{"E4_CODIGO":"425","E4_COND":"14,44,75,105","E4_DESCRI":"BB-14/44/75/105"},{"E4_CODIGO":"426","E4_COND":"10,28,56,84","E4_DESCRI":"BB - 10,28,56,84"},{"E4_CODIGO":"501","E4_COND":"07,14,21,28,35","E4_DESCRI":"BB-07/14/21/28/35"},{"E4_CODIGO":"502","E4_COND":"7,28,42,56,70","E4_DESCRI":"BB-7/28/42/56/70"},{"E4_CODIGO":"503","E4_COND":"14,28,42,56,70","E4_DESCRI":"BB-14/28/42/56/70"},{"E4_CODIGO":"504","E4_COND":"28,42,56,70,84","E4_DESCRI":"BB-28/42/56/70/84"},{"E4_CODIGO":"505","E4_COND":"14,21,28,35,42","E4_DESCRI":"BB-14/21/28/35/42"},{"E4_CODIGO":"601","E4_COND":"28,56,84,112,140,168","E4_DESCRI":"BB-28/56/84/112/140/168"},{"E4_CODIGO":"602","E4_COND":"21,42,63,84,105,126","E4_DESCRI":"BB-21/42/63/84/105/126"},{"E4_CODIGO":"603","E4_COND":"14,28,56,84,112,140","E4_DESCRI":"BB-14/28/56/84/112/140"},{"E4_CODIGO":"604","E4_COND":"14,28,42,56,70,84","E4_DESCRI":"BB-14/28/42/56/70/84"},{"E4_CODIGO":"605","E4_COND":"7,28,56,84,112,140","E4_DESCRI":"BB-7/28/56/84/112/140"},{"E4_CODIGO":"606","E4_COND":"30,60,90,120,150,180","E4_DESCRI":"BB-30/60/90/120/150/180"},{"E4_CODIGO":"610","E4_COND":"30,60,90,120,150,180,210,240,270,300","E4_DESCRI":"BB-CLIENTE 10X"},{"E4_CODIGO":"64","E4_COND":"64","E4_DESCRI":"BB-64D"},{"E4_CODIGO":"701","E4_COND":"7,14,21,28,35,42,49","E4_DESCRI":"BB-7/14/21/28/35/42/49"},{"E4_CODIGO":"801","E4_COND":"0","E4_DESCRI":"DINHEIRO"},{"E4_CODIGO":"802","E4_COND":"10","E4_DESCRI":"FORNEC. 10 D"},{"E4_CODIGO":"803","E4_COND":"15","E4_DESCRI":"FORNEC.15 D"},{"E4_CODIGO":"804","E4_COND":"30","E4_DESCRI":"FORN 30 D"},{"E4_CODIGO":"805","E4_COND":"45","E4_DESCRI":"FORN 45 D"},{"E4_CODIGO":"806","E4_COND":"60","E4_DESCRI":"FORN 60 D"},{"E4_CODIGO":"807","E4_COND":"105","E4_DESCRI":"FORNEC 105D"},{"E4_CODIGO":"808","E4_COND":"30","E4_DESCRI":"FORN 30"},{"E4_CODIGO":"809","E4_COND":"21","E4_DESCRI":"FORNEC. 21D"},{"E4_CODIGO":"810","E4_COND":"28","E4_DESCRI":"FORN 28 DIAS"},{"E4_CODIGO":"811","E4_COND":"0","E4_DESCRI":"TRANSF BANCARIA"},{"E4_CODIGO":"812","E4_COND":"0","E4_DESCRI":"CHEQUE"},{"E4_CODIGO":"813","E4_COND":"0","E4_DESCRI":"DOC"},{"E4_CODIGO":"814","E4_COND":"2","E4_DESCRI":"TED"},{"E4_CODIGO":"815","E4_COND":"0","E4_DESCRI":"FORN BOLETA"},{"E4_CODIGO":"816","E4_COND":"180","E4_DESCRI":"FORN 180D"},{"E4_CODIGO":"821","E4_COND":"30,60","E4_DESCRI":"FORN 30/60"},{"E4_CODIGO":"822","E4_COND":"20,40","E4_DESCRI":"FORN 20/40"},{"E4_CODIGO":"823","E4_COND":"35","E4_DESCRI":"FORN 35D"},{"E4_CODIGO":"831","E4_COND":"30,60,90","E4_DESCRI":"FORN 30/60/90"},{"E4_CODIGO":"840","E4_COND":"30,60,90,120,150","E4_DESCRI":"FORN 30/60/90/120/150"},{"E4_CODIGO":"841","E4_COND":"30,60,90,120","E4_DESCRI":"FORN 30/60/90/120"},{"E4_CODIGO":"842","E4_COND":"30,60,90,120,150,180","E4_DESCRI":"FORN 30/60/90/120/150/180"},{"E4_CODIGO":"851","E4_COND":"30,60,90,120,150","E4_DESCRI":"CH"},{"E4_CODIGO":"880","E4_COND":"23,34,49,57,78,91,105,118","E4_DESCRI":"FORN 8X"},{"E4_CODIGO":"889","E4_COND":"16,27,36,49,57,67","E4_DESCRI":"FORN 16/27/36/49/57/67"},{"E4_CODIGO":"89","E4_COND":"30,60,90,120,150,180,210,240,270","E4_DESCRI":"CC - AMEX 9X"},{"E4_CODIGO":"890","E4_COND":"30,60,90,120,150,180,210,240,270,300","E4_DESCRI":"FORN 10X"},{"E4_CODIGO":"891","E4_COND":"30,60,90,120,150,180,210,240,270,300,330,360","E4_DESCRI":"FORNEC 12X"},{"E4_CODIGO":"892","E4_COND":"42,48,56,68,78,89,96,111,118,131,138","E4_DESCRI":"FORN 11X"},{"E4_CODIGO":"893","E4_COND":"28,56","E4_DESCRI":"FORN 28,56"},{"E4_CODIGO":"894","E4_COND":"1,30,60,90,120,150,180","E4_DESCRI":"FORN1+6X"},{"E4_CODIGO":"895","E4_COND":"1,30,60,90,120","E4_DESCRI":"FORN 1+ 4X"},{"E4_CODIGO":"896","E4_COND":"30,60,90,120,150","E4_DESCRI":"FORN 5X"},{"E4_CODIGO":"897","E4_COND":"30,60,90,120,150,180,210,240,270,300,330,360,390,420,450,480,510,540,570,600,630,660,690,720","E4_DESCRI":"FORN 24X"},{"E4_CODIGO":"90","E4_COND":"90","E4_DESCRI":"BB - 90  DIAS"},{"E4_CODIGO":"901","E4_COND":"30","E4_DESCRI":"CC-ATACADO-1X"},{"E4_CODIGO":"902","E4_COND":"30,60","E4_DESCRI":"CC-ATACADO-2X"},{"E4_CODIGO":"903","E4_COND":"30,60,90","E4_DESCRI":"CC-ATACADO-3X"},{"E4_CODIGO":"904","E4_COND":"30,60,90,120","E4_DESCRI":"CC-ATACADO-4X"},{"E4_CODIGO":"905","E4_COND":"30,60,90,120,150","E4_DESCRI":"CC-ATACADO-5X"},{"E4_CODIGO":"906","E4_COND":"30,60,90,120,150,180","E4_DESCRI":"CC-ATACADO-6X"},{"E4_CODIGO":"99","E4_COND":"0","E4_DESCRI":"DINHEIRO"},{"E4_CODIGO":"CMP","E4_COND":"0","E4_DESCRI":"COMPENSACAO RA/PA"},{"E4_CODIGO":"CN","E4_COND":"1","E4_DESCRI":"CN"},{"E4_CODIGO":"PIX","E4_COND":"0","E4_DESCRI":"PIX"},{"E4_CODIGO":"SPG","E4_COND":"SPG","E4_DESCRI":"SEM PAGAMENTO"},{"E4_CODIGO":"TIK","E4_COND":"45","E4_DESCRI":"TICKET LOG"},{"E4_CODIGO":"TRF","E4_COND":"999","E4_DESCRI":"TRANSFERENCIA"}],"mensagem": ""}}
