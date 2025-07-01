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
      { displayName: 'Item', dataKey: 'C6_ITEM', alignment: 'center' },
      { displayName: 'Código do Produto', dataKey: 'C6_PRODUTO', alignment: 'center' },
      { displayName: 'Quantidade', dataKey: 'C6_QTDVEN', alignment: 'center' },
      { displayName: 'Valor Unit.', dataKey: 'C6_PRCVEN', alignment: 'center', formatFn: formatCurrency },
      { displayName: 'Total', dataKey: 'C6_VALOR', formatFn: formatCurrency },
    ]}
    title='Itens do pedido'
    style={style}
  />
  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', gap: '15px' }}>
    <span style={{ fontSize: '1em', fontWeight: 'bold' }}>
      Quantidade: {orderItems?.reduce((acc, item) => acc + item.C6_QTDVEN, 0)}
    </span>
    <span style={{ fontSize: '1em', fontWeight: 'bold' }}>
      Total: { formatCurrency(orderItems?.reduce((acc, item) => acc + item.C6_VALOR, 0))}
    </span>
  </div>
  </>
}

export default OrderItemsTable
