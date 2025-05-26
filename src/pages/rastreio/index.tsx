
import React, { FC, useEffect, useState } from 'react'

import tire from '../../assets/img/tire.png'
import logo from '../../assets/img/logo.png'
import partner from '../../assets/img/partner.png'
import pedido from '../../assets/img/pedido.png'
import faturado from '../../assets/img/faturado.png'
import transito from '../../assets/img/transito.png'
import entregue from '../../assets/img/entregue.png'
import arrow from '../../assets/img/arrow.png'
import arrowoff from '../../assets/img/arrowoff.png'
import api from '../../shared/infra/services/api'


import './index.scss'
import { useSearchParams } from 'react-router-dom'
//import { toast } from 'react-toastify'

/**
  const STATUS_CARGA = {
    0: 'Carregando',
    1: 'Em Pedido',
    2: 'Faturado',
    3: 'Em Trânsito',
    4: 'Entregue'
  }
*/


const RastreioPage: FC = (): JSX.Element => {

  const [status, setStatus] = useState<number>(2)
  const [retorno, setRetorno] = useState([])
  const [searchParams] = useSearchParams();

  function getStatusRastreio() {

    
    api.get(`/COLETAROTEIRO/${searchParams.get('filial')}/${searchParams.get('num')}`)
    .then((response) => {  

      if(response?.data.dados[0]['STATUSROT'].trim() === '01') {
        setStatus(3)
      }

      if(response?.data.dados[0]['STATUSROT'].trim() === '04') {
        setStatus(4)
      }

      setRetorno(response?.data?.dados)

    })
    .catch((error) =>{
      console.log(error)
    })

  }

  useEffect(() => {
    getStatusRastreio()
  }, [])

  if(!retorno.length) {

    return <main className='rastreio-page w-100 h-100 paddless'>
    <div className='form-container'>
      <div className='images-header'>
        <img className='logo' src={logo} alt='logo' />
        <img className='tire' src={tire} alt='pneu'  />
      </div>
      <h2>Rastreio de Pedido</h2>
      <h1>Aguarde, Carregando...</h1>
    </div>
  </main>
  }  
  

  return <main className='rastreio-page w-100 h-100 paddless'>
    <div className='form-container'>
      <div className='images-header'>
        <img className='logo' src={logo} alt='logo' />
        <img className='tire' src={tire} alt='pneu'  />
      </div>
      <h2>Rastreio de Pedido</h2>
      <h3>Nota Fiscal {retorno[0]['ZH_DOC']} / {retorno[0]['ZH_SERIE']}</h3>
      <h3>{retorno[0]['A1_NOME']}</h3>

      <div className='container-rastreio'>

        
        {/* <div className='image-container'>
          <img src={pedido} alt="pedido" className='image-status' />
          <h2>Em pedido</h2>
        </div>

        <div className='container-arrow'>
          <img className='arrow' src={status > 1 ? arrow : arrowoff} alt="arrow" />
        </div> */}

        <div className={status > 1 ? 'image-container' : 'image-container disfoque'}>
          <img src={faturado} alt="faturado" className='image-status' />
          <h2>Faturado</h2>
        </div>

        <div className='container-arrow'>
          <img className={status === 2 ? 'blink arrow' : 'arrow'} src={status > 1 ? arrow : arrowoff} alt="arrow" />
        </div>

        <div className={status > 2 ? 'image-container' : 'image-container disfoque'}>
          <img src={transito} alt="transito" className='image-status' />
          <h2>Em Trânsito</h2>
        </div>
        
        <div className='container-arrow'>
          <img className={status === 3 ? 'blink arrow' : 'arrow'} src={status > 2 ? arrow : arrowoff} alt="arrow" />
        </div>

        <div className={status > 3 ? 'image-container' : 'image-container disfoque'}>
          <img src={entregue} alt="entregue" className='image-status' />
          <h2>Entregue</h2>
        </div>

      </div>
     
      <img className='partner' src={partner} alt='dunloop' />
    </div>
  </main>
}

export default RastreioPage
