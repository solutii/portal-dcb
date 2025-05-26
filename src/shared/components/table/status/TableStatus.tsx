import React, { FC } from 'react'

import './TableStatus.scss'

interface TableStatusProps {
  status: string
  statusColor: Record<any, string>
  statusLabels: Record<any, string>
}

const TableStatus: FC<TableStatusProps> = ({ status, statusColor, statusLabels }): JSX.Element => 
  <div className='order-status' style={{ background: statusColor[status] }}>
    <span>{ statusLabels[status] }</span>
  </div>

export default TableStatus
