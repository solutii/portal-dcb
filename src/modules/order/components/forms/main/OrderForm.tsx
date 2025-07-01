import React, { FC, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

import type { IFormField } from '../../../../../shared/components/form/field/Field'
import type { Order, OrderItem } from '../../../models'
import type { Product } from '../../../../product/models'

import { useStore } from '../../../../../shared/infra/store'
import { handleDateFormattingForDateInput } from '../../../../../shared/utils/date'
import { getProductPrice } from '../../../../product/services'

import Modal from '../../../../../shared/components/modal'
import Button from '../../../../../shared/components/button/Button'
import CustomForm from '../../../../../shared/components/form/Form'
import ProductTable from '../../../../product/components/table/ProductTable'
import OrderFormItem from './item/OrderFormItem'

interface OrderFormProps {
  isEnabled: boolean
  onSubmit: (order: Order) => Promise<boolean>
  onClose: () => void
}

const OrderForm: FC<OrderFormProps> = ({ isEnabled, onSubmit, onClose }: OrderFormProps): JSX.Element => {
  const beforeUnLoad = (e: BeforeUnloadEvent) => {
    e.preventDefault()
    e.stopImmediatePropagation()
    e.returnValue = "leave"
  }

  useEffect(() => {
    window.addEventListener('beforeunload', beforeUnLoad);

    return () => {
      window.removeEventListener('beforeunload', beforeUnLoad);
    };
  }, [])

  const store = useStore()

  const { orderReducer: { 
    state: { order, orderPaymentMethods }, 
    dispatch: orderDispatch } 
  } = store

  const [ isProductsTableModalEnabled, setIsProductsTableModalEnabled ] = useState<boolean>(false)
  const [ orderItems, setOrderItems ] = useState<OrderItem[]>([])

  const handleModalClose = () => {
    //comentado para manter os itens do pedido ao fechar o modal
    //setOrderItems([])
    onClose()
  }
  
  const handleAddItemButtonClick = () => {
    if (!order.C5_COND) {
      toast('É necessário primeiramente selecionar a condição de pagamento', { autoClose: 6000 })
      return
    }
    setIsProductsTableModalEnabled(true)
  }
  
  const handleProductTableRowClick = async (product: Product) => {
    // if (product.ESTOQUE <= 0) {
    //   toast(`Não há estoque para o produto ${product.B1_DESC}`, { autoClose: 6000 })
    //   return
    // }

    try {
      const updatingOrderItems: OrderItem[] = [ 
        ...orderItems, 
        {
          C6_ITEM: `${orderItems.length > 8 ? '' : orderItems.length > 98 ? '0' : '00'}${orderItems.length + 1}`,
          C6_PRODUTO: product.B1_COD,
          C6_LOCAL: product.B1_LOCPAD,
          B1_DESC: product.B1_DESC,
          C6_QTDVEN: 1,
          C6_PRCVEN: product.PRCVEN,
          //C6_PRCVEN: await getProductPrice(product.B1_COD, order.C5_COND, store),
          C6_PRCUNI: product.PRCVEN,
          C6_VALOR: product.PRCVEN,
          ESTOQUE: product.ESTOQUE,
        }
      ]

      setOrderItems(updatingOrderItems)
  
      toast(`Produto ${product.B1_DESC} adicionado`, { autoClose: 6000 })

    } catch (err) {
      console.log(err)
    }
  }
    

  const handleOrderFormChange = (field: keyof Order, value: any) => {
    if (field === 'C5_COND') 
      orderDispatch({ type: 'SET_ORDER', payload: { ...order, C5_COND: value } })
  }

  const handleOrderFormItemFieldChange = (orderItemIndex: number, field: keyof OrderItem, value: any) => {
    const updatingOrderItems = [ ...orderItems ]

    if (field === 'C6_QTDVEN') { 
      if (value > orderItems[orderItemIndex].ESTOQUE! || value > 100) {
        toast(`Quantidade indisponível`, { autoClose: 6000 })
        return
      }

      updatingOrderItems[orderItemIndex].C6_VALOR = updatingOrderItems[orderItemIndex].C6_PRCVEN * value
    }

    ;(updatingOrderItems[orderItemIndex] as any)[field] = value

    setOrderItems(updatingOrderItems)
  }

  const handleOrderFormItemFieldDelete = (orderItemIndex: number) => {
    let updatingOrderItems = [ ...orderItems ]
    
    if (order.C5_NUM)
      updatingOrderItems[orderItemIndex].AUTDELETA = 'S'

    if (!order.C5_NUM)
      updatingOrderItems = ([ ...updatingOrderItems.slice(0, orderItemIndex), ...updatingOrderItems.slice(orderItemIndex + 1) ])
    
    setOrderItems(updatingOrderItems)
  }

  const handleOrderFormSubmit = async (order: Order) => {
    const _orderItems = [ ...orderItems ]
    _orderItems.forEach(orderItem => { delete orderItem.ESTOQUE })

    const wasSuccessfullySubmitted = await onSubmit({ ...order, items: _orderItems })
    if (wasSuccessfullySubmitted)
      setOrderItems([])
  }

  const handleProductsModalClose = () => setIsProductsTableModalEnabled(false)

  useEffect(() => { 
    if (order.C5_NUM)
      order.items!.map(item => ({ ...item, AUTDELETA: 'N' }))
  }, [])

  const formFields: IFormField[][] = [
    [ 
      {
        type: 'date',
        name: 'C5_EMISSAO',
        label: 'Data de Inclusão',
        formatFn: handleDateFormattingForDateInput,
        rules: { required: true },
        disabled: true
      },
      {
        type: 'select',
        name: 'C5_COND',
        label: 'Condição de Pagamento',
        rules: { required: true },
        options: orderPaymentMethods?.map(orderPaymentMethod => ({
          label: orderPaymentMethod.E4_DESCRI,
          value: orderPaymentMethod.E4_CODIGO
        }))
      },
      /*{
        type: 'select',
        name: 'C5_TPFRETE',
        label: 'Tipo do Frete',
        rules: { required: true },
        options: [
          { 
            label: 'CIF',
            value: 'C'
          },
          { 
            label: 'FOB',
            value: 'F'
          },
          { 
            label: 'Por conta de terceiros',
            value: 'T'
          },
          { 
            label: 'Por conta de remetente',
            value: 'R'
          },
          { 
            label: 'Por conta de destinatario',
            value: 'D'
          },
          { 
            label: 'Sem frete',
            value: 'S'
          }
        ]
      },*/
    ],
    [ { 
      type: 'element',
      element: <OrderFormItem 
        orderItems={orderItems}
        onFieldChange={handleOrderFormItemFieldChange}
        onFieldDelete={handleOrderFormItemFieldDelete} 
      />
    }],
    [{
      type: 'element',
      element: <Button
        style={{ 
          width: 175, 
          height: 40, 
          margin: '0 auto 15px 0',
          fontSize: 12,
          fontWeight: 600
        }} 
        onClick={handleAddItemButtonClick}
      >
        + Adicionar Produto 
      </Button>
    }],
    /*[{ 
      type: 'element',
      element: order.items?.length ? <div style={{ width: 560 }}>
        <label style={{ fontWeight: 'bold' }}>Itens</label>
        <Paper 
          variant="outlined"
          component="ul"
          style={{ padding: '13px 5px', width: '100%' }}
        >
          {order.items.map((orderItem, i) => 
            <Chip
              key={i}
              label={`(${orderItem.C6_QTDVEN}x) ${getProductDescriptionByID(orderItem.C6_DESCR, products)}`}
              variant="outlined"
              onClick={() => handleOrderItemChipClick(i)}
              style={{ margin: '0.4rem',  color: 'black' }}
            />
          )}
        </Paper>
      </div> : <></>
    }],
    [{ 
      type: 'element',
      element: orderAddingProducts.length ? <div style={{ width: 560 }}>
        <label style={{ fontWeight: 'bold' }}>Novos Itens</label>
        <Paper 
          variant="outlined"
          component="ul"
          style={{ padding: '13px 5px', marginTop: 10, width: '100%' }}
        >
          {orderAddingProducts.map((orderAddingProduct, i) => 
            <Chip
              key={i}
              label={`(${orderAddingProduct.quantity}x) - ${orderAddingProduct.B1_DESC}`}
              variant="outlined"
              onClick={() => handleOrderItemChipClick(i)}
              onDelete={() => handleOnOrderItemChipDeleteClick(i)}
              style={{ margin: '0.4rem', color: 'black', cursor: 'pointer' }}
            />
          )}
        </Paper>
      </div> : <></>
    }],*/
    [{
      type: 'submit',
      name: 'submit',
      label: order.C5_NUM ? 'Salvar' : 'Fechar Pedido',
    }],
  ]

  useEffect(() => {
    if (isEnabled && order.C5_NUM) 
      setOrderItems(order.items!.map(item => ({ ...item, AUTDELETA: 'N' })))
  }, [isEnabled])

  return <Modal 
    isEnabled={isEnabled} 
    onClose={handleModalClose}
    style={{ maxWidth: 1024 }}
  >
    <CustomForm 
      fields={formFields}
      values={order}
      onChange={handleOrderFormChange}
      onSubmit={handleOrderFormSubmit}
    />
    <Modal 
      isEnabled={isProductsTableModalEnabled} 
      onClose={handleProductsModalClose}
      style={{ maxWidth: 1024, maxHeight: '95%' }}
    >
      <ProductTable 
        mode='select'
        onRowClick={handleProductTableRowClick}
        style={{ margin: '25px 0' }}
      />
    </Modal>
  </Modal>
}

export default OrderForm
