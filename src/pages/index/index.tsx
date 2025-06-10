import React, { FC, useState, CSSProperties, useEffect } from 'react'
import { FormControl, MenuItem, Select, SelectChangeEvent, SxProps, Theme } from '@mui/material'
import { 
  ResponsiveContainer, BarChart, LineChart, RadialBarChart,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, RadialBar, Line 
} from 'recharts'

import { Order } from '../../modules/order/models'
import { CustomerPayable } from '../../modules/customer/models'

import { useStore } from '../../shared/infra/store'
import { filterOrdersByPeriod, generateOrderStatusReport, getOrderStatusReportByProducts, getTotalOrderValue, getOrdersValueSumByMonth, getOrdersBestSellers } from '../../modules/order/services'
import { filterCustomerPayablesByPeriod, getPayablesStatusReport, getPayablesStatusReportByMonth, getPayablesPayedQuantity, getPayablesPayedTotal, getPayablesOpenedTotal, getPayablesOpenedQuantity } from '../../modules/customer/services'
import { generateReportChartData } from '../../modules/report/services'
import { formatCurrency } from '../../shared/utils/currency'

import Card from '../../shared/components/card/Card'
import CustomPieChart from '../../shared/components/chart/PieChart'
import CustomChartTooltip from '../../shared/components/chart/tooltip/ChartTooltip'

import appTheme from '../../assets/styles/theme'
import './index.scss'
import CustomChartTooltipProducts from '../../shared/components/chart/tooltip/ChartTooltipProducts'


const IndexPage: FC = (): JSX.Element => {

  const store = useStore()

  const { 
    orderReducer: { state: { orders, loading: orderLoading } },
    customerReducer: { state: { payable, loading: payableLoading } }
  } = store

  const filterPeriods = [30, 60, 90]
  const [ filteredOrders, setFilteredOrders ] = useState<Order[]>([])
  const [ filteredPayables, setFilteredPayables ] = useState<CustomerPayable[]>([])

  /*const generatePayableReportChartData = (): any => {
    const payableReport = generateOpenedPayablesReport(payable)

    return [ 
      { title: 'A vencer', value: payableReport.expirable, color: 'lightgreen' },
      { title: 'Vencidos', value: payableReport.expired, color: 'lightcoral' },
    ]
  }*/

  const handlePeriodFilterSelectChange = ({ target: { value }}: SelectChangeEvent) => {
    setFilteredOrders(filterOrdersByPeriod(parseInt(value), orders))
    setFilteredPayables(filterCustomerPayablesByPeriod(parseInt(value), payable))
  }

  const card = {
    style: {
      display: 'flex',
      flexFlow: 'column',
      margin: '15px 5px 0',
      width: '100%', 
      maxWidth: 600,
      height: 520,
      color: appTheme.palette.secondary.main,
      borderRadius: 20,
      border: `2px solid ${appTheme.palette.secondary.main}`,
      boxShadow: '1px 2px 9px 1px gray',
      '&:hover': {
        border: `2px solid ${appTheme.palette.primary.main}`,
        boxShadow: '1px 2px 9px 1px darkgoldenrod'
      }     
    },
    contentStyle: {
      margin: 'auto 0',
      height: '100%',
      paddingTop: 5, 
      fontSize: 50,
      color: appTheme.palette.secondary.main,
      fontWeight: 'bold',
    } 
  } as { [key: string]: SxProps<Theme> | CSSProperties }


  useEffect(() => setFilteredPayables(payable), [payable])
  useEffect(() => setFilteredOrders(orders), [orders])

  return <main className='index-page'>
    <div className='filter-container'>
      <label style={{ color: appTheme.palette.secondary.main }}>Filtrar por período</label>
      <FormControl style={{ width: '100%', marginTop: 5 }}>
        <Select 
          style={{ height: 40, background: 'white' }}
          onChange={handlePeriodFilterSelectChange}
        > 
          <MenuItem value={-1}>Sem filtro </MenuItem>
          { filterPeriods.map((filterPeriod, i) => 
            <MenuItem value={filterPeriod} key={i}>{`Últimos ${filterPeriod} dias`}</MenuItem>
          )}
        </Select>
      </FormControl>
    </div>
    <div className='data-container'>
      {/* <Card 
        loading={orderLoading.orders} 
        style={{ ...card.style }}
        contentStyle={{ height: '100%'}}
      >
        <CustomPieChart 
          title='Pedidos Colocados' 
          data={generateReportChartData('orderStatus', generateOrderStatusReport(filteredOrders), 'randomColorFill') || [] }
          containerStyle={{ height: '100%' }}
        />
      </Card> */}
      {/* <Card 
        title='Produtos mais pedidos'
        loading={orderLoading.orders} 
        style={{ ...card.style }}
        contentStyle={{ height: '100%', marginTop: 2 }}
      >
        { filteredOrders.length ? 
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart 
              data={generateReportChartData('ordersBestSellers', getOrdersBestSellers(filteredOrders), 'randomColorFill')}
              layout='vertical'
              margin={{
                right: 50,
                left: 50,
              }}
            >
              <XAxis type='number' />
              <YAxis type='category' dataKey='name' hide />
              <Bar 
                barSize={25}
                label={({x, height, y, name, value }) => {
                  return <text 
                    x={x + 10} 
                    y={y + height - 5} 
                    fontSize='16' 
                    fontFamily='sans-serif'
                    fill='black'
                    textAnchor='start'
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {name}:&nbsp;{ value }
                  </text>
                }}
                dataKey='value'
              />
          </BarChart>
          </ResponsiveContainer> 
          :
          '-'
        }
      </Card> */}
      {/* <Card 
        title='Pedidos por mês (em R$)'
        loading={orderLoading.orders}
        style={{ ...card.style }}
        contentStyle={{ height: '100%', marginTop: 3 }}
      >
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart 
            data={generateReportChartData('ordersValueSumByMonth', getOrdersValueSumByMonth(orders)) || []}
            margin={{
              top: 5,
              right: 25,
              left: 47,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='1 0' vertical={false} />
            <XAxis dataKey='name' />
            <YAxis tickFormatter={(value: any) => formatCurrency(value as number)}/>
            <Tooltip content={({ active, payload, label }) => 
              <CustomChartTooltip 
                active={active}
                label={`Mês: ${label}`}
                payload={payload}
                fieldsToCurrencyFormat={['total']}
              />}
            />
            <Line 
              dataKey='total'
              type='monotone'  
              stroke='#038ef9'
              strokeDasharray='1 0' 
              strokeWidth={5} 
            />
            <Legend formatter={(value, entry, index) => 'Total em Reais'} />
          </LineChart>
        </ResponsiveContainer>
      </Card> */}
      <Card 
        title='Contas a Pagar' 
        style={{ ...card.style }}
        loading={payableLoading.loading}
        contentStyle={{ height: '100%' }}
      >
        <ResponsiveContainer width='100%' height='100%'>
          <RadialBarChart
            cx='50%'
            cy='50%'
            innerRadius={107}
            outerRadius={165}
            barSize={17}
            data={generateReportChartData('payableStatus', getPayablesStatusReport(filteredPayables)) || []}
          >
            <RadialBar
              label={{ position: 'insideStart', fill: 'black' }}
              background
              dataKey='value'
            />
            <Legend
              iconSize={12}
              width={120}
              height={140}
              layout="vertical"
              verticalAlign="middle"
              wrapperStyle={{
                top: 130,
                left: 250,
                lineHeight: '24px',
              }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <h3 style={{ margin: '25px auto 0', color: appTheme.palette.secondary.main }}>
          Total: { formatCurrency(filteredPayables.reduce((prev: any, curr: CustomerPayable) => prev + curr.E1_VALOR, 0))}
        </h3>
      </Card>
      <Card 
        title='Contas a Pagar Anual' 
        style={{ ...card.style }}
        loading={payableLoading.loading}
        contentStyle={{ height: '100%' }}
      >
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart 
            data={generateReportChartData('payableStatusByMonth', getPayablesStatusReportByMonth(filteredPayables)) || []} 
            margin={{ left: -20, right: 20 }}
          >
            <CartesianGrid strokeDasharray='1 0' vertical={false} />
            <XAxis dataKey='name' />
            <YAxis dataKey='total' />
            <Tooltip 
              content={({ active, payload, label }) => 
                <CustomChartTooltip 
                  active={active}
                  label={`Mês: ${label}`}
                  payload={payload}
                />
              }
            />
            <Legend />
            <Bar 
              dataKey='pago' 
              barSize={12} 
              minPointSize={5}
              fill='#2ee8a9'
            />
            <Bar 
              dataKey='aberto' 
              barSize={12} 
              minPointSize={5}
              fill='#fa6078'
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card 
        title='Valor Total de Compras' 
        content={formatCurrency(getTotalOrderValue(filteredOrders))} 
        style={card.style} 
        contentStyle={{ ...card.contentStyle, height: 'unset' }}
        loading={orderLoading.orders} 
      />
      <Card 
        title='Total de Compras por Produto' 
        style={{ ...card.style }}
        loading={payableLoading.loading}
        contentStyle={{ height: '100%' }}
      >
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart 
            data={generateReportChartData('orderReportByProducts', getOrderStatusReportByProducts(filteredOrders)) || []} 
            margin={{ left: 0, right: 20 }}
          >
            <CartesianGrid strokeDasharray='1 0' vertical={false} />
            <XAxis dataKey='Produto' />
            <YAxis dataKey='Total' />
            <Tooltip 
              content={({ active, payload, label }) => 
                <CustomChartTooltipProducts 
                  active={active}
                  payload={payload}
                />
              }
            />
            <Legend />
            <Bar 
              dataKey='Total' 
              barSize={18} 
              minPointSize={5}
              fill='#2ee8a9'
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card 
        title='Total de Compras Pagas' 
        style={card.style} 
        contentStyle={{ height: '100%' }} 
        loading={payableLoading.loading} 
      >
        <div style={{ height: '100%', }}>
          <h3 style={{ margin: '70% auto 0', color: appTheme.palette.secondary.main, fontSize: '25px'}}>
            Total: { getPayablesPayedQuantity(filteredPayables)}
          </h3>
          <h3 style={{ margin: '60px auto 0', color: appTheme.palette.secondary.main, fontSize: '25px' }}>
            Quantidade: { formatCurrency(getPayablesPayedTotal(filteredPayables)) }
          </h3>
        </div>
      </Card>
      <Card 
        title='Total de Compras em Aberto' 
        style={card.style} 
        contentStyle={{ height: '100%' }} 
        loading={payableLoading.loading} 
      >
        <div style={{ height: '100%', }}>
          <h3 style={{ margin: '70% auto 0', color: appTheme.palette.secondary.main, fontSize: '25px'}}>
            Total: { getPayablesOpenedQuantity(filteredPayables)}
          </h3>
          <h3 style={{ margin: '60px auto 0', color: appTheme.palette.secondary.main, fontSize: '25px' }}>
            Quantidade: { formatCurrency(getPayablesOpenedTotal(filteredPayables)) }
          </h3>
        </div>
      </Card>
    </div>
  </main>
}

export default IndexPage
