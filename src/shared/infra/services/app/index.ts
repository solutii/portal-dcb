import type { Customer } from '../../../../modules/customer/models'
import type { Company } from '../../../../modules/company/models'
import type { Store } from '../../store'

import { Order, OrderItem } from '../../../../modules/order/models'

import { storeCustomer , getPayables } from '../../../../modules/customer/services'
import { storeCompanies } from '../../../../modules/company/services'
import { getOrderPaymentMethods, getOrders, getOrdersItems, setOrdersItems } from '../../../../modules/order/services'
import { getProducts } from '../../../../modules/product/services'

export const mainAppDispatch = async (customer: Customer, companies: Company[], store: Store) => {
  const { 
    customerReducer: { dispatch: customerDispatch },
    orderReducer: { dispatch: orderDispatch },
    companyReducer: { dispatch: companyDispatch },
    productReducer: { dispatch: productDispatch }
  } = store

  const company: Company = companies[0]
  companyDispatch({ type: 'SET_COMPANY', payload: { ...company, FILIAL: "01" } })
  
  storeCustomer(customer, customerDispatch)
  storeCompanies(companies, companyDispatch)
  
  await getOrderPaymentMethods(orderDispatch)
  await getProducts(productDispatch)
}
