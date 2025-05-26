import React, { FC, useState } from 'react'

import Modal from '../../../../shared/components/modal'
import { useStore } from '../../../../shared/infra/store'

import './index.scss'

interface PayablePixProps {
  imageSrc: string
}

const PayablePix: FC<PayablePixProps> = ({ imageSrc }) => {
  const { customerReducer: { state: { customer } }} = useStore()
  
  return <div className='payable-pix-container'>
    <h3>Cliente: { customer.A1_NOME }</h3>
    <img src={`data:image/jpeg;base64,${imageSrc}`} alt='pix' />
    <span>Utilize o app de seu banco para escanear o QR CODE e efetuar o pagamento</span>
  </div>
}

export default PayablePix
