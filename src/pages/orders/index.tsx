import React, { FC } from 'react'
import OrderTable from '../../modules/order/components/tables/OrderTable'

import './index.scss'

const OrdersPage: FC = (): JSX.Element => {
  return <main className='orders-page'>
    <OrderTable />
  </main>
}

export default OrdersPage
