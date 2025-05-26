
import React, { FC, useState } from 'react'

import type { Company } from '../models'
import type { IFormField } from '../../../shared/components/form/field/Field'
import { useStore } from '../../../shared/infra/store'

import Modal from '../../../shared/components/modal'
import CustomForm from '../../../shared/components/form/Form'
import { cgcUtils } from '../../../shared/utils/cgc'


interface CompanyChooserProps {
  onSubmit: (companyPosition: number) => Promise<void>
}

const CompanyChooser: FC<CompanyChooserProps> = ({ onSubmit }: CompanyChooserProps) => {
  const [ isEnabled, setIsEnabled ] = useState<boolean>(true)
  const [ companyFormValues, setCompanyFormValues ] = useState<Company>({} as Company)

  const { companyReducer: { state: { companies } } } = useStore()

  const handleCompanyFormClose = () => { 
    alert('Necessário selecionar a empresa para operar o sistema.')
  }
  
  const handleCompanyFormFieldChange = (field: string, value: any) => {
    (companyFormValues as any)[field] = value
    setCompanyFormValues(companyFormValues)
  }

  const handleCompanyFormSubmit = async (data: any): Promise<void> => { 
    await onSubmit(data.company)
    setIsEnabled(false)
  }

  const fields: IFormField[] = [
    {
      type: 'select',
      name: 'company',
      label: 'Empresas',
      rules: { required: true },
      options: companies.map((company, i) => ({
        label: `${cgcUtils.maskaraCnpj(company.A1_CGC??"")} ${company.A1_NREDUZ}`,
        value: i
      })),
    },
    {
      name: 'submit',
      type: 'submit',
      label: 'OK'
    }
  ]
  
  if (!isEnabled)
    return null

  return <Modal
    isEnabled={isEnabled}
    title='Selecionar Empresa'
    style={{ height: 310, maxWidth: 500 }}
    onClose={handleCompanyFormClose}
  > 
    <CustomForm 
      fields={fields}
      values={companyFormValues}
      onChange={handleCompanyFormFieldChange}
      onSubmit={handleCompanyFormSubmit}
      style={{
        justifyContent: 'space-between',  
        width: '100%',
        height: '100%',
        margin: 'auto',
        overflowY: 'hidden',
        padding: 0
      }}
    />
  </Modal>
}

export default CompanyChooser
