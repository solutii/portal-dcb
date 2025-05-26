import { useState, type MouseEvent } from 'react'

export const useMUITablePagination = (rowsPerPage: number): any => {
  const [ page, setPage ] = useState<number>(0)
  const [ limit, setLimit ] = useState<number>(rowsPerPage)

  const handleLimitChange = ({ target: { value }}: any) => setLimit(value)
  const handlePageChange = (_: MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => setPage(page)

  return {
    page,
    limit,
    handleLimitChange,
    handlePageChange, 
    rowsPerPageOptions: [5, 10, 25, 50, 100, { label: 'Todos', value: -1 }]
  }
}

export default useMUITablePagination