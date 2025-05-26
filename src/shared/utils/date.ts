export const formatDate = (date: number): string => date ? new Date(date).toLocaleString('pt-BR', { dateStyle: 'short' }) : '-'

const formatDateToYMD = (date: string) => {
  const splittedDate = date.split('/')

  if (date.length < 3)
    return ''

  const year = splittedDate[2].length === 2 ? `20${splittedDate[2]}` : splittedDate[2]

  return `${year}-${splittedDate[1]}-${splittedDate[0]}`
}

export const handleDateFormattingForDateInput = (date: string): string => {
  if (!date)
    return '-'

  if (date.includes('-'))
    return date
  
  if (date.includes('/')) 
    return formatDateToYMD(date)
  
  return `${date.slice(6,8)}/${date.slice(4,6)}/${date.slice(2,4)}`
}

export const formatDateToApiRequest = (date: string): string => {
  if (!date)
    return '-'

  if (date.includes('/'))
    date = formatDateToYMD(date)

  if (date.includes('-'))
    date = date.replaceAll('-', '')

  return date
}

export const getReportCurrentPeriod = (): any => {
  const today = new Date()
  const lastDate = new Date(new Date().setDate(today.getDay()-365))
  const lastDay = lastDate.getDay();
  const lastMonth = lastDate.getMonth() + 1
  const month = today.getMonth() + 1
  const yearAndMonth = `${today.getFullYear()}${month < 10 ? `0${month}` : month}`

  return { 
    firstDayOfMonth: `${lastDate.getFullYear()}${lastMonth < 10 ? `0${lastMonth}` : lastMonth}01`,
    lastDayOfMonth: `${yearAndMonth}${new Date(today.getFullYear(), today.getMonth()+1, 0).getDate()}`
  }
}
