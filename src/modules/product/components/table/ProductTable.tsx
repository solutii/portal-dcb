import React, { FC, CSSProperties, useState, useCallback, useEffect } from 'react'
import { TextField } from '@mui/material'
import { Search } from '@mui/icons-material'

import { Product } from '../../models'

import { useStore } from '../../../../shared/infra/store'
import { debounce } from '../../../../shared/utils/functions'

import Table from '../../../../shared/components/table/Table'
import TableToolbar from '../../../../shared/components/table/toolbar/TableToolbar'
import { filterList } from '../../../../shared/utils/list'
import appTheme from '../../../../assets/styles/theme'


interface ProductTableProps {
  mode?: 'search' | 'select'
  style?: CSSProperties
  onRowClick?: (product: Product) => void
}

const ProductTable: FC<ProductTableProps> = ({ mode = 'search', style, onRowClick }): JSX.Element => {
  const { productReducer: { state: { products, loading } } } = useStore()
  const [ currentProducts, setCurrentProducts ] = useState<Product[]>([])

  //const handleTableSearchInputChange = (value: string) => setCurrentProducts(filterList(products, value))

  const handleTableIDTextFieldChange = (value: string) => 
    setCurrentProducts(filterList(products, value, 'B1_COD'))  

  const handleTableDescriptionTextFieldChange = (value: string) => 
    setCurrentProducts(filterList(products, value, 'B1_DESC'))
  
  //const debouncedHandleTableSearchInputChange = useCallback(debounce(handleTableSearchInputChange, 500), [])
  const debouncedHandleTableIDSearchInputChange = useCallback(debounce(handleTableIDTextFieldChange, 500), [])
  const debouncedHandleTableDescriptionSearchInputChange = useCallback(debounce(handleTableDescriptionTextFieldChange, 500), [])


  const handleRowColumnClick = async (rowIndex: number, columnName: string, rowData?: any) => {
    if (mode !== 'select') 
      return

    if (!onRowClick) 
      return

    onRowClick(rowData as Product)
  }

  useEffect(() => setCurrentProducts(products), [loading])
      
  return <Table
    data={currentProducts}
    columns={[
      { displayName: 'Código', dataKey: 'B1_COD', alignment: 'center' },
      { displayName: 'Descrição', dataKey: 'B1_DESC', alignment: 'center' },
      //{ displayName: 'Estoque', dataKey: 'ESTOQUE', alignment: 'center' },
      //{ displayName: 'Tipo', dataKey: 'B1_TIPO', alignment: 'center' },
      //{ displayName: 'Un. de Medida', dataKey: 'B1_UM', alignment: 'center' },
      //{ displayName: 'LOCPAD', dataKey: 'B1_LOCPAD', alignment: 'center' },
      //{ displayName: 'PE', dataKey: 'B1_PE', alignment: 'center' },
    ]}
    title='Produtos'
    toolbarContent={
      <TableToolbar>
        <TextField 
          type='text'
          label='Pesquisar por código'
          onChange={({ target: { value }}) => debouncedHandleTableIDSearchInputChange(value)}
          InputProps={{ endAdornment: <Search style={{ color: appTheme.palette.secondary.main }} /> }}
          size='small'
          style={{
            margin: '0 auto 0 15px',
            width: 275,
          }}
        />
        <TextField 
          type='text'
          label='Pesquisar por descrição'
          onChange={({ target: { value }}) => debouncedHandleTableDescriptionSearchInputChange(value)}
          InputProps={{ endAdornment: <Search style={{ color: appTheme.palette.secondary.main }} /> }}
          size='small'
          style={{
            margin: '0 auto 0 15px',
            width: 275,
          }}
        />
      </TableToolbar> 
    }
    onRowColumnClick={handleRowColumnClick}
    selectable={mode === 'select'}
    rowsPerPage={18}
    loading={Object.values(loading).some(v => v)}
    style={style}
  />
}

export default ProductTable
