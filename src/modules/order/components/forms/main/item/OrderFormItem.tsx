import React, { FC, useEffect, ReactNode } from 'react'
import { TextField } from '@mui/material'
import { CancelPresentation } from '@mui/icons-material'

import { OrderItem } from '../../../../models'

import { useStore } from '../../../../../../shared/infra/store'
import { getProductDescriptionByID } from '../../../../../product/services'

import TooltipIconButton from '../../../../../../shared/components/tooltip-icon-button/TooltipIconButton'

import './OrderFormItem.scss'
import appTheme from '../../../../../../assets/styles/theme'


interface OrderFormItemProps {
  orderItems: OrderItem[]
  onFieldChange?: (orderItemIndex: number, field: keyof OrderItem, value: any) => void
  onFieldDelete?: (orderItemIndex: number) => void
}

const OrderFormItem: FC<OrderFormItemProps> = ({ orderItems, onFieldChange = () => {}, onFieldDelete = () => {} }): JSX.Element => {
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

  const { productReducer: { state: { products } } } = useStore()

  const handleFieldChange = onFieldChange
  const handleDeleteButtonClick = onFieldDelete

  if (!orderItems.length) 
    return <></>

  return <div className='order-item-container'>
    <h3>Itens</h3>
    <div className='field-group-container'>
      {orderItems.filter(orderItem => orderItem.AUTDELETA !== 'S').map((orderItem, i) =>  
        <div className='field-group' key={i}>
          <div className='field'>
            <TextField 
              type='text'
              label='Item Nº'
              value={i+1}
              size='small'
              InputLabelProps={{ shrink: true }}
              disabled={true}
              style={{ width: '100%' }}
            />
          </div>
          <div className='field'>
            <TextField 
              type='text'
              label='Código'
              value={orderItem.C6_PRODUTO}
              size='small'
              InputLabelProps={{ shrink: true }}
              disabled={true}
              style={{ width: '100%' }}
            />
          </div>
          <div className='field'>
            <TextField 
              type='text'
              label='Descrição'
              value={getProductDescriptionByID(orderItem.C6_PRODUTO, products)}
              size='small'
              InputLabelProps={{ shrink: true }}
              disabled={true}
              style={{ width: 225 }}
            />
          </div>
          <div className='field'>
            <TextField 
              type='number'
              label='Quantidade'
              value={orderItem.C6_QTDVEN}
              onChange={({ target: { value }}) => handleFieldChange(i, 'C6_QTDVEN', parseInt(value))}
              size='small'
              InputLabelProps={{ shrink: true }}
              style={{ width: '100%' }}
            />
          </div>
          <div className='field'>
            <TextField 
              type='text'
              label='Vl. Unitário'
              value={orderItem.C6_PRCVEN}
              size='small'
              InputLabelProps={{ shrink: true }}
              style={{ width: '100%' }}
              disabled
            />
          </div>
          <div className='actions'>
            <TooltipIconButton 
              title='Excluir' 
              onClick={() => handleDeleteButtonClick(i)} 
              disabled={false}
            >
              <CancelPresentation style={{ color: appTheme.palette.secondary.main }} />
            </TooltipIconButton>
          </div>
        </div>
      )}
      <br />
      <div className='field-group'>
      <div className='field' />
      <div className='field' />
      <div className='field' />
        <div className='field'>
          <TextField 
            type='text'
            label='Quantidade Total'
            value={orderItems.reduce((acc, orderItem) => acc + (orderItem.C6_QTDVEN), 0)}
            size='small'
            InputLabelProps={{ shrink: true }}
            style={{ width: '90%' }}
            disabled
          />
        </div>
        <div className='field'>
          <TextField
            type='text'
            label='Valor Total'
            value={orderItems.reduce((acc, orderItem) => acc + (orderItem.C6_QTDVEN * orderItem.C6_PRCVEN), 0)}
            size='small'
            InputLabelProps={{ shrink: true }}
            style={{ width: '90%' }}
            disabled
          />
          </div>

      </div>
    </div>
  </div>
}

export default OrderFormItem