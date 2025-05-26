import { ReportType } from '../models'

import appTheme from '../../../assets/styles/theme'
import { getRandomLightColor } from '../../../shared/utils/colors'

export const generateReportChartData = (report: ReportType, data: any | any[], fillType?: 'primaryColorFill' | 'randomColorFill') => {
  if (!data || (Array.isArray(data) && !data.length)) 
    return []

  let reportData: any[] = []

  switch(report) {
    case 'orderStatus': 
      reportData = [
        { name: 'Em aberto', value: data.open, fill: '#fa6078' },
        { name: 'Liberados', value: data.comercialReleased, fill: '#2ee8a9' },
        { name: 'Liberação Comercial', value: data.financialReleased, fill: '#8973d5' },
        { name: 'Efetivado Parcialmente', value: data.partialEffective },
        { name: 'Efetivado', value: data.canceled },
        { name: 'Faturado Parcialmente', value: data.partialBilled },
        { name: 'Faturado', value: data.billed, fill: '#2ea0ff' },
        { name: 'Negado', value: data.denied },
        { name: 'Cancelado', value: data.canceled },
      ]
      break
    
    case 'ordersBestSellers':
      reportData = data.map((orderItem: any) => ({
        name: orderItem.Z9_DESCR,
        value: orderItem.Z9_QUANT
      }))
      break

    /*case 'ordersByMonth':
      reportData = [
        { name: 'Jan', total: data['01'] }, { name: 'Fev', total: data['02'] }, { name: 'Mar', total: data['03'] }, { name: 'Abr', total: data['04'] },
        { name: 'Mai', total: data['05'] }, { name: 'Jun', total: data['06'] }, { name: 'Jul', total: data['07'] }, { name: 'Ago', total: data['08'] },
        { name: 'Set', total: data['09'] }, { name: 'Out', total: data['10'] }, { name: 'Nov', total: data['11'] }, { name: 'Dez', total: data['12'] },
      ]
      break*/

    case 'ordersValueSumByMonth':
      reportData = [
        { name: 'Jan', total: data['01'] }, { name: 'Fev', total: data['02'] }, { name: 'Mar', total: data['03'] }, { name: 'Abr', total: data['04'] },
        { name: 'Mai', total: data['05'] }, { name: 'Jun', total: data['06'] }, { name: 'Jul', total: data['07'] }, { name: 'Ago', total: data['08'] },
        { name: 'Set', total: data['09'] }, { name: 'Out', total: data['10'] }, { name: 'Nov', total: data['11'] }, { name: 'Dez', total: data['12'] },
      ]
      break

    case 'payableStatus':
      reportData = [
        { name: 'Em aberto', value: data.open, fill: '#fa6078' },
        { name: 'Pagos', value: data.paid, fill: '#25e3a3' },
        { name: 'Total', value: data.total, fill: '#269dfb' },
      ]
      break

      case 'payableStatusByMonth':
        reportData = [
          { name: 'Jan', aberto: data['01'].open, pago: data['01'].paid, total: data['01'].total }, 
          { name: 'Fev', aberto: data['02'].open, pago: data['02'].paid, total: data['02'].total },  
          { name: 'Mar', aberto: data['03'].open, pago: data['03'].paid, total: data['03'].total },  
          { name: 'Abr', aberto: data['04'].open, pago: data['04'].paid, total: data['04'].total },  
          { name: 'Mai', aberto: data['05'].open, pago: data['05'].paid, total: data['05'].total },   
          { name: 'Jun', aberto: data['06'].open, pago: data['06'].paid, total: data['06'].total },  
          { name: 'Jul', aberto: data['07'].open, pago: data['07'].paid, total: data['07'].total },   
          { name: 'Ago', aberto: data['08'].open, pago: data['08'].paid, total: data['08'].total },  
          { name: 'Set', aberto: data['09'].open, pago: data['09'].paid, total: data['09'].total },   
          { name: 'Out', aberto: data['10'].open, pago: data['10'].paid, total: data['10'].total },   
          { name: 'Nov', aberto: data['11'].open, pago: data['11'].paid, total: data['11'].total },   
          { name: 'Dez', aberto: data['12'].open, pago: data['12'].paid, total: data['12'].total },  
        ]
      break

      case 'orderReportByProducts':
        data.forEach(function(product: any) {
          reportData.push({ 
            Nome: product.description,
            Produto: product.description.slice(0,6),
            Quantidade: product.quantity,
            Total: product.total  
          })
        })
      break
  }

  if (fillType) {
    const fill = fillType === 'primaryColorFill' ? appTheme.palette.primary.main : getRandomLightColor('85%') 
    
    reportData = reportData.map(data => ({ 
      ...data, 
      ...(!data.fill && { fill })
    }))
  }

  return reportData
}
