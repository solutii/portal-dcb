import type { Dispatch } from 'react'
import type { Company, CompanyStateActions } from '../models'

export const storeCompanies = (companies: Company[], dispatch: Dispatch<CompanyStateActions>) => 
  dispatch({ type: 'SET_COMPANIES', payload: companies })

