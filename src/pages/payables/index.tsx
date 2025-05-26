import React, { FC } from 'react'
import PayableTable from '../../modules/customer/components/table/PayableTable'

import './index.scss'

const PayablePage: FC = (): JSX.Element => {
  return <main className='payables-page'>
    <PayableTable />
  </main>
}

export default PayablePage
