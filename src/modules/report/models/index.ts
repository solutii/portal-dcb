export interface Report {
  name: string
  [key: string]: any
}

export type ReportType = 'orderStatus' | 'ordersBestSellers' | /*'ordersByMonth'*/ 'ordersValueSumByMonth' | 'payableStatus' | 'payableStatusByMonth' | 'orderReportByProducts'
