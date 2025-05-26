import type { Dispatch } from 'react'
import { Customer, CustomerPayable, CustomerPayableRequest, CustomerPayableDetailRequest, CustomerState, CustomerStateActions, CustomerPayableStatus } from '../models'
import { toast } from 'react-toastify'

import { Store } from '../../../shared/infra/store'

import api from '../../../shared/infra/services/api'
import { getReportCurrentPeriod } from '../../../shared/utils/date'


export const storeCustomer = (customer: Customer, dispatch: Dispatch<CustomerStateActions>) =>
  dispatch({ type: 'SET_CUSTOMER', payload: customer })

export const updateCustomer = async (customer: Customer, dispatch?: Dispatch<CustomerStateActions>): Promise<Customer | void> => {
  try {
    const response = await api.post('/ALTERACLIENTE', customer)
    api.handleResponse(response)

    if (dispatch) {
      dispatch({ type: 'SET_CUSTOMER', payload: customer })
      return 
    }

    return customer
  } catch (err) {
    toast('Falha ao alterar cliente')
    return
  }
}

const formatPayableDate = (date: string): string => `${date.substring(6,8)}/${date.substring(4,6)}/${date.slice(0,4)}`

export const getPayables = async (customer: Customer, dispatch: Dispatch<CustomerStateActions>): Promise<CustomerPayable[] | void> => { 
  const { firstDayOfMonth, lastDayOfMonth } = getReportCurrentPeriod()

  const customerPayablesRequest: CustomerPayableRequest = {
    CLIENTE: customer.A1_COD,
    LOJA: customer.A1_LOJA,
    DATAINI: firstDayOfMonth,
    DATAFIM: lastDayOfMonth
  }
  
  dispatch({ type: 'SET_LOADING', payload: { loading: true, loadingId: '' } })

  try {
    const response = await api.post('/COLETAFINANCEIRO', customerPayablesRequest)
    api.handleResponse(response)

    let customerPayable: CustomerPayable[] = response.data.dados
      .map((payable: CustomerPayable) => ({ 
        ...payable,
        E1_EMISSAO: formatPayableDate(payable.E1_EMISSAO),
        E1_VENCREA: formatPayableDate(payable.E1_VENCREA),
        ...(payable.E1_BAIXA && { E1_BAIXA: formatPayableDate(payable.E1_BAIXA) })
      }))
    customerPayable.sort((a, b) => ((a.E1_VENCREA||"") > (b.E1_VENCREA||"") ? -1 : 1))

    if (dispatch) {
      dispatch({ type: 'SET_CUSTOMER_PAYABLE', payload: customerPayable })
      dispatch({ type: 'SET_LOADING', payload: { loading: false, loadingId: '' }})
    }

    return customerPayable
  } catch (err) {
    toast('Falha ao obter contas a pagar')
    if (dispatch) {
      dispatch({ type: 'SET_CUSTOMER_PAYABLE', payload: [] })
      dispatch({ type: 'SET_LOADING', payload: { loading: false, loadingId: '' }})
    }
    return
  }
}

export const getPayablePix = async (payable: CustomerPayable): Promise<string | void> => {
  const payablePixRequest: CustomerPayableDetailRequest = {
    PREFIXO: payable.E1_PREFIXO,
    NUMERO: payable.E1_NUM,
    PARCELA: payable.E1_PARCELA,
    TIPO: payable.E1_TIPO
  }

  try {
    const response = await api.post('/PIXFINANCEIRO', payablePixRequest)
    api.handleResponse(response)


    if(response.data?.sucesso === 'F') {
      toast("Erro. " + response.data.mensagem)
      return
    }
    
    const pixBase64Image = response.data?.dados[0].IMAGEM
    if (!pixBase64Image)
      throw new Error('Failed to retrieve payable pix')

    return pixBase64Image
    
  } catch (err) {
    console.log(err)
    toast('Falha ao obter a chave pix')
    return
  }    
}

export const getPayableBankSlipCode = async (payable: CustomerPayable, store: Store): Promise<string | void> => {
  const { companyReducer: { state: { company } }} = store

  const payableBankSlipRequest: CustomerPayableDetailRequest = {
    PREFIXO: payable.E1_PREFIXO,
    NUM: payable.E1_NUM,
    PARCELA: payable.E1_PARCELA,
    TIPO: payable.E1_TIPO,
    FILIAL: company.FILIAL?? '01',
  }

  try {
    const response = await api.post('/COLETABOLETO', payableBankSlipRequest)
    api.handleResponse(response)
    
    const code = response.data?.dados[0].CODIGO
    if (!code)
      throw new Error('Failed to retrieve payable pix')

    return code
    
  } catch (err) {
    console.log(err)
    toast('Falha ao obter a chave pix')
    return
  }    
}

export const getPayableBankSlipDoc = async (payable: CustomerPayable, store: Store): Promise<any> => {
  const {
     customerReducer: { dispatch },
     companyReducer: { state: { company } }
    } = store

  const payableBankSlipRequest: CustomerPayableDetailRequest = {
    PREFIXO: payable.E1_PREFIXO,
    NUM: payable.E1_NUM,
    PARCELA: payable.E1_PARCELA,
    TIPO: payable.E1_TIPO,
    FILIAL: company.FILIAL?? '01',
  }

  dispatch({ type: 'SET_LOADING', payload: { loading: false, loadingId: `${payable.E1_NUM!}PDF` }})
  try {
    const response = await api.post('/COLETABOLETO', payableBankSlipRequest).then(r => api.handleResponse(r))
    const fileName = response.data?.dados[0].ARQUIVO
    const fileContent = await api.downloadFile(fileName).then(r => r.data)

    if (!fileContent)
      throw new Error('Failed to retrieve file content')
      dispatch({ type: 'SET_LOADING', payload: { loading: false, loadingId: '' }})
    return {name: fileName, content: fileContent}

  } catch (err) {
    console.log(err)
    toast('Falha ao obter o boleto')
    dispatch({ type: 'SET_LOADING', payload: { loading: false, loadingId: '' },})
    return
  }    
}

const _parseStringToDate = (date: string): Date => {
    const day = parseInt(date.slice(0, 2));
    const month = parseInt(date.slice(3, 5));
    const year =  parseInt(date.slice(6, 10));
    let fullDate = new Date(`${year}-${month}-${day}`);
    fullDate.setHours(0, 0, 0, 0);
    return fullDate;
}

export const filterCustomerPayablesByPeriod = (period: number, payables: CustomerPayable[]): CustomerPayable[] => {
  if (period === -1) 
    return payables

  const initialDate = new Date()
  initialDate.setDate(initialDate.getDate() - period)
  initialDate.setHours(0, 0, 0, 0);
  return payables.filter(payable => initialDate.getTime() <= _parseStringToDate(payable.E1_EMISSAO).getTime())
}

export const getPayablesPayedQuantity = (payable: CustomerPayable[]): number => {
  return payable.filter(p => p.STATUS === '3').length
}

export const getPayablesPayedTotal = (payable: CustomerPayable[]): number => {
  let total = 0;
  const filteredPayable = payable.filter(p => p.STATUS === '3');
  filteredPayable.forEach(function(item) {
    total += item.E1_VALOR;
  });
  return total;
}

export const getPayablesOpenedQuantity = (payable: CustomerPayable[]): number => {
  return payable.filter(p => p.STATUS !== '3').length
}

export const getPayablesOpenedTotal = (payable: CustomerPayable[]): number => {
  let total = 0;
  const filteredPayable = payable.filter(p => p.STATUS !== '3');
  filteredPayable.forEach(function(item) {
    total += item.E1_VALOR;
  });
  return total;
}

export const getPayablesStatusReport = (payable: CustomerPayable[]): any => ({
  open: payable.filter(payable => payable.STATUS !== '3').length,
  paid: payable.filter(payable => payable.STATUS === '3').length,
  total: payable.length
})

export const getPayablesStatusReportByMonth = (payable: CustomerPayable[]): any => {
  const payableCountByYearMonth = Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => i + 1).map(month => {
      const monthStr = month < 10 ? `0${month}` : `${month}`
      return [monthStr, { open: 0, paid: 0, total: 0 }]
    })
  )

  payable.forEach(({ STATUS, E1_EMISSAO }) => {
    const payableEmissionMonth = E1_EMISSAO.split('/')[1]
    const monthValues = payableCountByYearMonth[payableEmissionMonth]

    monthValues.paid += STATUS === '3' ? 1 : 0
    monthValues.open += STATUS !== '3' ? 1 : 0
    monthValues.total++
  })

  return payableCountByYearMonth
}

export const filterCustomerPayablesByStatus = (payables: CustomerPayable[], status: CustomerPayableStatus | CustomerPayableStatus[]) => 
  payables.filter(payable => 
    Array.isArray(status) ? status.includes(payable.STATUS as CustomerPayableStatus) : payable.STATUS === status
  )
