import React, { FC, ReactNode, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { ContentCopy, Description, Download } from '@mui/icons-material'
import { type SelectChangeEvent, MenuItem, Select } from '@mui/material'
import { saveAs } from 'file-saver'

import { type Order, orderStatusLabels, OrderStatus } from '../../models'

import { useStore } from '../../../../shared/infra/store'
import { createOrder, getOrderXML, getOrderNFE, removeOrder, updateOrder, verifyOrderTaxes } from '../../services'
import { formatCurrency } from '../../../../shared/utils/currency'

import useConfirmationDialog from '../../../../shared/hooks/useConfirmationDialog'

import Table from '../../../../shared/components/table/Table'
import TableToolbar from '../../../../shared/components/table/toolbar/TableToolbar'
import TableStatus from '../../../../shared/components/table/status/TableStatus'
import TooltipIconButton from '../../../../shared/components/tooltip-icon-button/TooltipIconButton'
import Modal from '../../../../shared/components/modal'
import OrderItemsTable from './OrderItemsTable'
import OrderForm from '../forms/main/OrderForm'
import Confirmation from '../../../../shared/components/dialog/Confirmation'
import OrderTaxTable from './OrderTaxTable'

import appTheme from '../../../../assets/styles/theme'
import { Loader } from '../../../../shared/components/loader'
import { toInteger } from 'lodash'

const OrderTable: FC = (): JSX.Element => {

  const store = useStore()
  
  const { orderReducer: { state: { orders, loading }, dispatch } } = store
  const [ filteredOrders, setFilteredOrders ] = useState<Order[]>(orders)

  const [ isOrderFormModalEnabled, setIsOrderFormModalEnabled ] = useState<boolean>(false)
  const [ isOrderItemsTableModalEnabled, setIsOrderItemsTableModalEnabled ] = useState<boolean>(false)
  const [ isOrderTaxesTableModalEnabled, setIsOrderTaxesTableModalEnabled ] = useState<boolean>(false)
  const [ loadingList, setLoadingList ] = useState<Array<any>>([])

  const { isConfirmationDialogEnabled, openConfirmationDialog, confirmationDialogMessage, handleConfirmationDialogResult } = useConfirmationDialog()

  const openItemsModal = () => setIsOrderItemsTableModalEnabled(true)
  const openTaxesModal = () => setIsOrderTaxesTableModalEnabled(true)
  
  const handleOrderItemsTableModalClose = async () => { 
    setIsOrderItemsTableModalEnabled(false)
    return true
  }

  const handleOrderTaxesTableModalClose = async () => { 
    setIsOrderTaxesTableModalEnabled(false)
    return true
  }

  const handleCopyRowButtonClick = (rowIndex: number) => {
    openConfirmationDialog(`Confirma a criação de um orçamento igual ao Nº ${orders[rowIndex].Z8_NUM} ?`, createOrder, [orders[rowIndex], store])
  }
  
  const handleAddToolbarButtonClick = () => {
    console.log("passou aqui")
    //dispatch({ type: 'RESET_ORDER' })
    setIsOrderFormModalEnabled(true)
  }

  const handleEditRowButtonClick = (rowIndex: number) => {
    //dispatch({ type: 'SET_ORDER', payload: orders[rowIndex] })
    setIsOrderFormModalEnabled(true)
  }

  const handleRemoveRowButtonClick = (rowIndex: number) => 
    openConfirmationDialog(`Confirma exclusão do orçamento Nº ${orders[rowIndex].Z8_NUM} ?`, removeOrder, [rowIndex, store])
    

  const handleOrderItemViewColumnClick = (rowIndex: number) => {
    dispatch({ type: 'SET_ORDER', payload: orders[rowIndex] })
    openItemsModal()
  }

  const handleOrderXMLDownloadColumnClick = async (rowIndex: number) => {
    try {
      loadingList.push(`${orders[rowIndex].Z8_NUM}XML`);
      setLoadingList(loadingList);
      const orderXmlBlob = await getOrderXML(orders[rowIndex], store)

      if (!orderXmlBlob)
      {
        loadingList.splice(loadingList.indexOf(`${orders[rowIndex].Z8_NUM}XML`), 1);
        setLoadingList(loadingList);
        return
      }

      saveAs(orderXmlBlob.content, orderXmlBlob.name)
      loadingList.splice(loadingList.indexOf(`${orders[rowIndex].Z8_NUM}XML`), 1);
      setLoadingList(loadingList);
    } finally {}
    
  }

  const handleOrderNFEDownloadColumnClick = async (rowIndex: number) => {
    try {
      loadingList.push(`${orders[rowIndex].Z8_NUM}NFE`);
      setLoadingList(loadingList);
      const orderNFeBlob = await getOrderNFE(orders[rowIndex], store)

      if (!orderNFeBlob) 
      {
        loadingList.splice(loadingList.indexOf(`${orders[rowIndex].Z8_NUM}NFE`), 1);
        setLoadingList(loadingList);
        return;
      }

      saveAs(orderNFeBlob.content, orderNFeBlob.name)
      loadingList.splice(loadingList.indexOf(`${orders[rowIndex].Z8_NUM}NFE`), 1);
      setLoadingList(loadingList);
    } finally {}
    
  }

  const handleOrderTaxesViewColumnClick = async (rowIndex: number) => {
    await verifyOrderTaxes(orders[rowIndex], store, rowIndex)
  
    dispatch({ type: 'SET_ORDER', payload: orders[rowIndex] })
    openTaxesModal()
  }

  const handleRowColumnClick = async (rowIndex: number, columnName: string) => {
    switch(columnName) {
      case 'items':
        handleOrderItemViewColumnClick(rowIndex)
        break

      case 'taxes':
        handleOrderTaxesViewColumnClick(rowIndex)
        break

      default:
    }
  }

  const handleOrderFormSubmit = async (order: Order): Promise<boolean> => {
    if (!order.items?.length) {
      toast('Não é possível criar o orçamento sem itens.')
      return false
    }

    for (const item of order.items)
      if (!(item.Z9_QUANT /*&& item.Z9_VUNIT*/)) {
        toast('Não é possível criar o orçamento enquanto houver itens sem valor ou quantidade.')
        return false
      }
    
    return await (order.Z8_NUM ? updateOrder : createOrder)(order, store)
      .then(() => { 
        setIsOrderFormModalEnabled(false)
        return true 
      })
      .catch(() => false)
  }
    
  const handleOrderFormClose = () => setIsOrderFormModalEnabled(false)

  const handleStatusFilterSelectChange = ({ target: { value }}: SelectChangeEvent) => {
    if (value === '-1')
      return setFilteredOrders(orders)

    setFilteredOrders(orders.filter(order => order.STATUS === value))
  }

  useEffect(() => { setFilteredOrders(orders) }, [orders])

  const getTableActionContent = (field: string, order: Order, element?: ReactNode) => {
  
    switch (field) {
      case 'downloadXML':
        // if (status === '7') 
        //   return '-'
        if (loadingList.indexOf(`${order.Z8_NUM!}XML`) != -1 && field == 'downloadXML')
          return <Loader 
            width={20} 
            height={20}
            color={appTheme.palette.primary.main}
            containerStyle={{ 
              display: 'flex',
              justifyContent: 'center',
              width: '100%'
            }} 
          /> 

          if (element) 
            return element
    
      break
      case 'downloadNFE':
        // if (status === '7') 
        //   return '-'

        if (loadingList.indexOf(`${order.Z8_NUM!}NFE`) != -1 && field == 'downloadNFE')
          return <Loader 
            width={20} 
            height={20}
            color={appTheme.palette.primary.main}
            containerStyle={{ 
              display: 'flex',
              justifyContent: 'center',
              width: '100%'
            }} 
          /> 

          if (element) 
            return element
    
      break
    }  
  }

  const generateDisplayableOrders = () => 
  filteredOrders?.sort((a,b) => toInteger(a.Z8_NUM) - toInteger(b.Z8_NUM))
  .reverse()
  .map((order, i) => ({
    ...order,
    STATUS: <TableStatus 
      status={order.STATUS}
      statusColor={{ 
        A: 'blue', L: 'green', B: 'green', F: 'green', M: 'green',
        E: 'green', P: 'green', O: '#ffd000', N: 'red', C: 'black'
      }}
      statusLabels={orderStatusLabels} 
    />,
    ...(order.Z8_EMISSAO && {Z8_EMISSAO: `${order.Z8_EMISSAO.slice(0,6)}20${order.Z8_EMISSAO.slice(-2)}`}),
    items: [],
    //taxes: [],
    downloadXML: getTableActionContent('downloadXML', order, <TooltipIconButton title='Baixar XML' onClick={() => handleOrderXMLDownloadColumnClick(i)}>
      <Download style={{ color: appTheme.palette.secondary.main }} />
    </TooltipIconButton>),
    downloadNFE: getTableActionContent('downloadNFE', order, <TooltipIconButton title='Baixar NFe' onClick={() => handleOrderNFEDownloadColumnClick(i)}>
      <Download style={{ color: appTheme.palette.secondary.main }} />
    </TooltipIconButton>),
    copyOrder: <TooltipIconButton title='Copiar' onClick={() => handleCopyRowButtonClick(i)}>
      <ContentCopy style={{ color: appTheme.palette.secondary.main }} />
    </TooltipIconButton>
  }))

  
  return <>
    <Table
      data={generateDisplayableOrders()}
      columns={[
        { displayName: 'Status', dataKey: 'STATUS', alignment: 'center' },
        { displayName: 'Nr Pedido', dataKey: 'Z8_NUM', alignment: 'center' },
        { displayName: 'Dt Inclusão', dataKey: 'Z8_EMISSAO', alignment: 'center' },
        { displayName: 'Condição de Pagamento', dataKey: 'E4_DESCRI', alignment: 'center' },
        { displayName: 'Qtd de Itens', dataKey: 'QTDITEM', alignment: 'center' },
        { displayName: 'Total', dataKey: 'TOTAL', formatFn: formatCurrency },
        { displayName: 'Itens', dataKey: 'items', alignment: 'center' },
        //{ displayName: 'Impostos', dataKey: 'taxes', alignment: 'center' },
        { displayName: 'Baixar XML', dataKey: 'downloadXML', alignment: 'center' },
        { displayName: 'Baixar NFe', dataKey: 'downloadNFE', alignment: 'center' },
        { displayName: 'Copiar Orç', dataKey: 'copyOrder', alignment: 'center' },
      ]}
      title='Orçamentos'
      toolbarContent={<TableToolbar> 
        <div style={{ 
          display: 'flex', 
          flexFlow: 'column',
          width: '95%',
          maxWidth: 250, 
          margin: '0 auto'
        }}>
          <label style={{ 
            marginBottom: 3, 
            fontWeight: 'bold', 
            color: appTheme.palette.secondary.main
          }}>
            Filtro
          </label>
            <Select 
              style={{
                width: '100%',
                height: 35,
                background: 'white'
              }}
              onChange={handleStatusFilterSelectChange}
            >
              <MenuItem value='-1'>Todas</MenuItem>
              {Object.entries(orderStatusLabels).map(([ key, value ]) =><MenuItem value={key}>{value}</MenuItem>)} 
            </Select>
        </div>
        
      </TableToolbar>}
      addToolbarButton={{ 
        caption: 'Fazer Um Pedido', 
        style: { 
          width: 350,
          height: 'auto',
          minHeight: 40,
          margin: '15px 0 15px 15px',
          paddingLeft: 35
        }
      }}
      onAddToolbarButtonClick={handleAddToolbarButtonClick}
      onRowColumnClick={handleRowColumnClick}
      //onEditRowButtonClick={handleEditRowButtonClick}
      //onRemoveRowButtonClick={handleRemoveRowButtonClick}
      loading={loading.orders}
    />
    
    <OrderForm 
      isEnabled={isOrderFormModalEnabled} 
      onSubmit={handleOrderFormSubmit}
      onClose={handleOrderFormClose} 
    />
    <Modal 
      isEnabled={isOrderItemsTableModalEnabled} 
      onClose={handleOrderItemsTableModalClose}
      style={{ maxWidth: 1024 }}
    >
      <OrderItemsTable style={{ margin: '25px 0' }} />
    </Modal>
    <Modal 
      isEnabled={isOrderTaxesTableModalEnabled} 
      onClose={handleOrderTaxesTableModalClose}
      style={{ maxWidth: 1024 }}
    >
      <OrderTaxTable style={{ margin: '25px 0' }} />
    </Modal>
    <Confirmation 
      enabled={isConfirmationDialogEnabled} 
      message={confirmationDialogMessage}  
      onResult={handleConfirmationDialogResult} 
    />
  </>
}

export default OrderTable
