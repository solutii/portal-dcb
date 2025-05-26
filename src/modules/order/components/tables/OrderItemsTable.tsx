import React, { FC, CSSProperties } from 'react'

import { useStore } from '../../../../shared/infra/store'
import { formatCurrency } from '../../../../shared/utils/currency'
import { filterList } from '../../../../shared/utils/list'

import Table from '../../../../shared/components/table/Table'

interface OrderItemsTableProps {
  style?: CSSProperties
}

const OrderItemsTable: FC<OrderItemsTableProps> = ({ style }): JSX.Element => {
  const {
    orderReducer: { state: { order: { items: orderItems } } }
  } = useStore()


  return <><Table
    data={orderItems!}
    columns={[
      { displayName: 'Item', dataKey: 'Z9_ITEM', alignment: 'center' },
      { displayName: 'Código do Produto', dataKey: 'Z9_PRODUTO', alignment: 'center' },
      { displayName: 'Quantidade', dataKey: 'Z9_QUANT', alignment: 'center' },
      { displayName: 'Valor Unit.', dataKey: 'Z9_VUNIT', alignment: 'center', formatFn: formatCurrency },
      { displayName: 'Total', dataKey: 'Z9_TOTAL', formatFn: formatCurrency },
    ]}
    title='Itens do orçamento'
    style={style}
  />
  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', gap: '15px' }}>
    <span style={{ fontSize: '1em', fontWeight: 'bold' }}>
      Quantidade: {orderItems!.reduce((acc, item) => acc + item.Z9_QUANT, 0)}
    </span>
    <span style={{ fontSize: '1em', fontWeight: 'bold' }}>
      Total: {formatCurrency(orderItems!.reduce((acc, item) => acc + item.Z9_TOTAL, 0))}
    </span>
  </div>
  </>
}

export default OrderItemsTable
