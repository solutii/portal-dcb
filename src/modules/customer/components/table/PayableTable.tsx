import React, { CSSProperties, FC, ReactNode, useEffect, useState } from 'react'
import { FileCopyOutlined, Download } from '@mui/icons-material'
import { saveAs } from 'file-saver'

import { CustomerPayable, CustomerPayableStatus, customerPayableStatus, PAYABLE_PAID_STATUS } from '../../models'

import { useStore } from '../../../../shared/infra/store'
import { getPayableBankSlipDoc, getPayablePix } from '../../services'
import { filterList } from '../../../../shared/utils/list'
import { formatCurrency } from '../../../../shared/utils/currency'
import { handleDateFormattingForDateInput } from '../../../../shared/utils/date'

import Table from '../../../../shared/components/table/Table'
import Modal from '../../../../shared/components/modal'
import TableStatus from '../../../../shared/components/table/status/TableStatus'
import PayablePix from '../payable-pix'
import appTheme from '../../../../assets/styles/theme'
import { Loader } from '../../../../shared/components/loader'

import TableActionLink from '../../../../shared/components/table/action-link/TableActionLink'
import TooltipIconButton from '../../../../shared/components/tooltip-icon-button/TooltipIconButton'
import { toast } from 'react-toastify'
import { toInteger } from 'lodash'


const PayableTable: FC = (): JSX.Element => {
  const store = useStore()
  const { customerReducer: { state: { payable, loading }} } = store

  const [ pixImageSrc, setPixImageSrc ] = useState<string>('')
  const [ bankSlipCode, setBankSlipCode ] = useState<string>('')

  const [ isPixModalEnabled, setIsPixModalEnabled ] = useState<boolean>(false)
  const [ isBankSlipModalEnabled, setIsBankSlipModalEnabled ] = useState<boolean>(false)
  const [ loadingList, setLoadingList ] = useState<Array<any>>([])

  const [ query, setQuery ] = useState<string>('')

  const handleTableSearchInputChange = (value: string) => setQuery(value.toLowerCase())

  const handlePixModalClose = () => setIsPixModalEnabled(false)

  const handleBankSlipCodeModalClose = () => setIsBankSlipModalEnabled(false)

  const handleObtainBankSlipDocActionClick = async (rowIndex: number) => {
    try{
      if (!isActionEnabled(rowIndex))
        return
      

      let loadingListAux = [ ...loadingList]

      loadingListAux.push(`${payable[rowIndex].E1_NUM}${payable[rowIndex].E1_PARCELA}PDF`)

      setLoadingList(loadingListAux);
      const bankSlipBlob = await getPayableBankSlipDoc(payable[rowIndex], store)

      if (!bankSlipBlob)
      {
        loadingListAux.splice(loadingListAux.indexOf(`${payable[rowIndex].E1_NUM}${payable[rowIndex].E1_PARCELA}PDF`), 1);
        setLoadingList(loadingListAux);
        return
      }

      saveAs(bankSlipBlob.content, bankSlipBlob.name)
      loadingListAux.splice(loadingListAux.indexOf(`${payable[rowIndex].E1_NUM}${payable[rowIndex].E1_PARCELA}PDF`), 1);
      setLoadingList(loadingListAux);
    }
    finally {}
  }
  const isActionEnabled = (rowIndex: number): boolean => payable[rowIndex].STATUS !== PAYABLE_PAID_STATUS

  const handleGeneratePixKeyColumnClick = async (rowIndex: number) => {
    if (!isActionEnabled(rowIndex))
      return

    const pixImageSrc = await getPayablePix(payable[rowIndex])

    if (pixImageSrc) {
      setPixImageSrc(pixImageSrc)
      setIsPixModalEnabled(true)
    }
  }

  const handleRowColumnClick = async (rowIndex: number, columnName: string) => {
    switch(columnName) {
      case 'generatePixKey':
        handleGeneratePixKeyColumnClick(rowIndex)
        break

      default:
    }
  }

  const getTableActionContent = (field: string, payable: CustomerPayable, element?: ReactNode) => {
    if (payable.STATUS === '3')
      return '-'

    switch (field) {
      case 'generatePixKey':

        break

      case 'obtainBankSlipDoc':

        if (loadingList.indexOf(`${payable.E1_NUM}${payable.E1_PARCELA}PDF`) != -1)
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

      break
    }

    if (element)
      return element
  }

  const generateDisplayablePayable = () => payable
  .sort((a,b) => {

    if(a.E1_NUM === b.E1_NUM)
      return toInteger(a.E1_PARCELA) - toInteger(b.E1_PARCELA)
    
    return toInteger(a.E1_NUM) - toInteger(b.E1_NUM) 
  } )
  .reverse()
  .map((payable, i) => ({
    ...payable,
    STATUS: <TableStatus
      status={payable.STATUS}
      statusColor={{ '0': 'red', '1': 'red', '2': 'blue', '3': 'green' }}
      statusLabels={customerPayableStatus}
    />,
    E1_EMISSAO: payable.E1_EMISSAO,
    E1_VENCREA: payable.E1_VENCREA,
    E1_VALOR: formatCurrency(payable.E1_VALOR),
    E1_MULTA: formatCurrency(payable.E1_MULTA),
    E1_BAIXA: payable.E1_BAIXA,
    generatePixKey: getTableActionContent('generatePixKey', payable, <TableActionLink>Gerar</TableActionLink>),
    obtainBankSlipDoc: getTableActionContent('obtainBankSlipDoc', payable, <TooltipIconButton title='Baixar Boleto' onClick={() => handleObtainBankSlipDocActionClick(i)}>
      <Download style={{ color: appTheme.palette.secondary.main }} />
    </TooltipIconButton>),
  }))

  const handleCopyTooltipIconButtonClick = () => {
    navigator.clipboard.writeText(bankSlipCode)
    toast('Código copiado para a área de transferência')
  }

  return <>
    <Table
      data={filterList(generateDisplayablePayable(), query)}
      columns={[
        { displayName: 'Status', dataKey: 'STATUS', alignment: 'center' },
        { displayName: 'Número NF', dataKey: 'E1_NUM', alignment: 'center' },
        { displayName: 'Prefixo', dataKey: 'E1_PREFIXO', alignment: 'center' },
        { displayName: 'Dt. de Inclusao', dataKey: 'E1_EMISSAO', alignment: 'center' },
        { displayName: 'Dt. de Venc.', dataKey: 'E1_VENCREA', alignment: 'center' },
        { displayName: 'Dt. de Baixa', dataKey: 'E1_BAIXA', alignment: 'center' },
        { displayName: 'Valor', dataKey: 'E1_VALOR', alignment: 'center' },
        { displayName: 'Juros', dataKey: 'E1_JUROS', alignment: 'center' },
        { displayName: 'Multa', dataKey: 'E1_MULTA', alignment: 'center' },
        /* { displayName: 'Boleto', dataKey: 'obtainBankSlipDoc', alignment: 'center' }, */
        /* { displayName: 'Chave Pix', dataKey: 'generatePixKey', alignment: 'center' }, */
      ]}
      title='Contas a Pagar'
      onRowColumnClick={handleRowColumnClick}
      loading={loading.loading}
    />
    <Modal
      isEnabled={isPixModalEnabled}
      onClose={handlePixModalClose}
    >
      <PayablePix imageSrc={pixImageSrc}/>
    </Modal>
    <Modal
      isEnabled={isBankSlipModalEnabled}
      onClose={handleBankSlipCodeModalClose}
    >
      <div className='flex flex-column'>
        <h2>Código do Boleto</h2>
        <div className='flex flex-row flex-center flex-between mt-25'>
          <h4>{ bankSlipCode }</h4>
          <TooltipIconButton
            title='Copiar'
            onClick={handleCopyTooltipIconButtonClick}
          >
            <FileCopyOutlined style={{ color: 'black' }} />
          </TooltipIconButton>
        </div>
      </div>
    </Modal>
  </>
}

export default PayableTable
