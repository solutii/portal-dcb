import React, { FC, useState } from 'react'

import type { IFormField } from '../../../../shared/components/form/field/Field'
import type { Customer } from '../../models'

import { useStore } from '../../../../shared/infra/store'

import Modal from '../../../../shared/components/modal'
import CustomForm from '../../../../shared/components/form/Form'


interface CustomerFormProps {
  isEnabled: boolean
  onSubmit: (customer: Customer) => Promise<boolean>
  onClose: () => void
}

const CustomerForm: FC<CustomerFormProps> = ({ isEnabled, onSubmit, onClose }: CustomerFormProps): JSX.Element => {
  const { customerReducer: { state: { customer } } } = useStore()

  const [ formValues, setFormValues ] = useState<Customer>(customer)

  const handleModalClose = () => onClose()
  
  
  const handleCustomerFormFieldChange = (field: string, value: any) => {
    (formValues as any)[field] = value
    setFormValues(formValues)
  }

  const handleCustomerFormSubmit = async (data: any) => await onSubmit(data)
  
  const formFields: IFormField[] = [
    {
      type: 'text',
      name: 'A1_NOME',
      label: 'Nome',
    },
    {
      type: 'text',
      name: 'A1_NREDUZ',
      label: 'Nome Abreviado',
    },
    {
      type: 'text',
      name: 'A1_END',
      label: 'Endereço',
    },
    {
      type: 'text',
      name: 'A1_BAIRRO',
      label: 'Bairro',
    },
    {
      type: 'text',
      name: 'A1_MUN',
      label: 'Município',
    },
    {
      type: 'text',
      name: 'A1_EST',
      label: 'Estado',
    },
    {
      type: 'text',
      name: 'A1_CEP',
      label: 'Cep',
    },
    {
      type: 'text',
      name: 'A1_DDD',
      label: 'DDD',
    },
    {
      type: 'text',
      name: 'A1_TEL',
      label: 'Telefone',
    },
    {
      type: 'text',
      name: 'A1_TELEX',
      label: 'Telex',
    },
    {
      type: 'text',
      name: 'A1_FAX',
      label: 'Fax',
    },
    {
      type: 'text',
      name: 'A1_CONTATO',
      label: 'Contato',
    },
    {
      type: 'submit',
      name: 'submit',
      label: 'Salvar',
    },
  ]

  return <Modal isEnabled={isEnabled} onClose={handleModalClose}>
    <CustomForm 
      fields={formFields}
      values={formValues} 
      onChange={handleCustomerFormFieldChange}
      onSubmit={handleCustomerFormSubmit}
      style={{ 
        height: '100%', 
        padding: '0 15px'
      }}
    />
  </Modal>
}

export default CustomerForm
