
import React, { FC, useEffect, useState } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import Helmet from 'react-helmet'

import { Store, useStore } from '../../shared/infra/store'

import type { Customer } from '../../modules/customer/models'

import { signOut } from '../../modules/authentication/services'
import { getPayables, updateCustomer } from '../../modules/customer/services'
//import { getOrders } from '../../modules/order/services'

//import Sidebar from './sidebar/Sidebar'
import Header from './header/Header'
import CompanyChooser from '../../modules/company/components/CompanyChooser'
import CustomerForm from '../../modules/customer/components/forms/CustomerForm'

import './Layout.scss'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Tab from './tab/Tab'

import { getOrderPaymentMethods, getOrders, getOrdersItems, setOrdersItems } from '../../modules/order/services'
import { Order, OrderItem } from '../../modules/order/models'
import { Company } from '../../modules/company/models'

const Layout: FC = () => {
  const {
    authReducer: { dispatch: authDispatch }, 
    customerReducer: { state: { customer }, dispatch: customerDispatch },
    companyReducer: { state: { company, companies }, dispatch: companyDispatch },
    orderReducer: { dispatch: orderDispatch }
  } = useStore()

  const store = useStore()

  const [isSidebarEnabled, setIsSidebarEnabled] = useState<boolean>(true)
  const [isCustomerFormEnabled, setIsCustomerFormEnabled] = useState<boolean>(false)
  
  const navigate = useNavigate()

  const handleHeaderMenuButtonClick = () => setIsSidebarEnabled(!isSidebarEnabled)

  const handleHeaderLogoutButtonClick = () => signOut(navigate, authDispatch)
  
  const handleCompanyChooserSubmit = async (companyIndex: number) => {
   /*  await getOrders(customer, companies[companyIndex] , orderDispatch) */
    companyDispatch({ type: 'SET_COMPANY', payload: { ...companies[companyIndex], FILIAL: "01" } })
    customerDispatch({ type: 'SET_CUSTOMER', payload:companies[companyIndex] })
    getRegisters(companies[companyIndex], companies[companyIndex], store)
  }

  

  const getRegisters = async (customer: Customer, company: Company, store: Store) => {
      getOrders(customer, company, store)
      .then(orders => {
        getOrdersItems(customer, company, orderDispatch)
          .then(ordersItems => 
            setOrdersItems(orders as Order[], ordersItems as OrderItem[], orderDispatch)
          )
      })
    await getPayables(customer, customerDispatch)
  }

  useEffect(() => {
    if(companies.length === 1) {
      getRegisters(companies[0], companies[0], store)
    }
  }, [])

  const handleCustomerFormClose = () => setIsCustomerFormEnabled(false)
  
  const handleCustomerFormSubmit = async (data: any) => {
    try {
      await updateCustomer(data as Customer, customerDispatch)
      return true
    } catch (err) {
      return false
    }
  }

  //const handleSidebarOptionClick = (optionIndex: number) => {
    //if (sidebarOptions[optionIndex].label === 'Meu Cadastro') 
      //setIsCustomerFormEnabled(true)
  //}

  const options = [
    { label: 'Orçamentos', to: '/orders' },
    { label: 'Contas a Pagar', to: '/payables' },
    { label: 'Resumo', to: '/' },
    { label: 'Trocar Senha', to: '/settings' },
    //{ label: 'Meu Cadastro' },
  ]

  return <div className='layout'>
    {
      // @ts-ignore
      <Helmet>
        <title>GV PNEUS</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='anonymous'></link>
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet"></link>
        <link rel='stylesheet' href='//cdn.quilljs.com/1.2.6/quill.snow.css'></link>
      </Helmet>
    }
    <Header onMenuButtonClick={handleHeaderMenuButtonClick} onLogoutButtonClick={handleHeaderLogoutButtonClick} />
    <div className='inner'>
      { company.A1_NOME && <>
        {/*<Sidebar 
          enabled={isSidebarEnabled} 
          options={sidebarOptions}
          //onOptionClick={handleSidebarOptionClick}
        />*/}
        <Tab 
          options={options}
          style={{ justifyContent: 'center', margin: '10px 0' }}
        />
        <Outlet />
        <CustomerForm
          isEnabled={isCustomerFormEnabled}
          onClose={handleCustomerFormClose}
          onSubmit={handleCustomerFormSubmit}
        />
      </>}
      { companies.length > 1 && <CompanyChooser onSubmit={handleCompanyChooserSubmit} />}
    </div>

  </div>
}

export default Layout
