import React, { FC, useState, useEffect } from 'react'

import type { IFormField } from '../../../../../shared/components/form/field/Field'
import type { OrderItem } from '../../../models'

import { useStore } from '../../../../../shared/infra/store'
import { handleDateFormattingForDateInput } from '../../../../../shared/utils/date'

import Modal from '../../../../../shared/components/modal'
import CustomForm from '../../../../../shared/components/form/Form'

interface OrderItemFormProps {
  isEnabled: boolean
  onSubmit: (orderItem: OrderItem) => Promise<void>
  onClose: () => void
}

const OrderItemForm: FC<OrderItemFormProps> = ({ isEnabled, onSubmit, onClose }: OrderItemFormProps): JSX.Element => {
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

  const { orderReducer: { state: { orderItem } } } = useStore()

  const handleModalClose = async () => onClose()

  const handleOrderItemFormSubmit = (data: any) => onSubmit(data)

  const [formFields, setFormFields] = useState<IFormField[]>([
    {
      type: 'text',
      name: 'C5_NUM',
      label: 'Pedido',
    },
    {
      type: 'text',
      name: 'C6_UM',
      label: 'Un. de Medida',
    },
    {
      type: 'text',
      name: 'C6_TES',
      label: 'TES',
    },
    {
      type: 'text',
      name: 'C6_QTDVEN',
      label: 'Quantidade',
    },
    {
      type: 'text',
      name: 'C6_PRCVEN',
      label: 'Preço Unit.',
    },
    {
      type: 'text',
      name: 'C6_PRCVEN',
      label: 'Preço de Venda',
    },
    {
      type: 'date',
      name: 'C5_ENTREG',
      label: 'Data',
      formatFn: handleDateFormattingForDateInput
    },
    {
      type: 'submit',
      name: 'submit',
      label: 'Salvar',
    },
  ])

  return <Modal isEnabled={isEnabled} onClose={handleModalClose}>
    <CustomForm 
      fields={formFields}
      values={orderItem} 
      onSubmit={handleOrderItemFormSubmit}
      style={{ 
        height: '100%', 
        padding: '0 15px'
      }}
    />
  </Modal>
}

export default OrderItemForm
