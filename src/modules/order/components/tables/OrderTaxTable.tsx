import React, { FC, CSSProperties } from 'react'

import { useStore } from '../../../../shared/infra/store'

import Table from '../../../../shared/components/table/Table'
import { formatCurrency } from '../../../../shared/utils/currency'

interface OrderTaxTableProps {
  style?: CSSProperties
}

const OrderTaxTable: FC<OrderTaxTableProps> = ({ style }): JSX.Element => {
  const { orderReducer: { state: { order: { taxes = [] } } } } = useStore()

  return <Table
    title='Impostos'
    data={taxes}
    columns={[
      { displayName: 'Descrição', dataKey: 'DESCRICAO', alignment: 'center' },
      { displayName: 'Base', dataKey: 'BASE', alignment: 'center', formatFn: formatCurrency },
      { displayName: 'Alíquota', dataKey: 'ALIQUOTA', alignment: 'center' },
      { displayName: 'Valor', dataKey: 'VALOR', alignment: 'center', formatFn: formatCurrency },
    ]}
    style={style}
  />
}

export default OrderTaxTable
