import React, { FC, HTMLAttributes, ReactNode } from 'react'

import './TableActionLink.scss'

interface TableActionLinkProps extends HTMLAttributes<HTMLSpanElement>  { 
  children?: ReactNode 
}

const TableActionLink: FC<TableActionLinkProps> = ({ children }): JSX.Element => <span className='table-action-link'>{ children }</span>

export default TableActionLink
