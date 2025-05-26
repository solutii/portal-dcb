
import React, { FC } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { StyledEngineProvider, ThemeProvider } from '@mui/material'
import { ToastContainer } from 'react-toastify'

import Layout from './shared/layout/Layout'
import RouteGuard from './shared/infra/router/RouteGuard'

import appTheme from './assets/styles/theme'

import LoginPage from './pages/login'
import IndexPage from './pages/index'
import OrdersPage from './pages/orders'
import PayablePage from './pages/payables'
import SettingsPage from './pages/settings'

import 'react-toastify/dist/ReactToastify.css'
import './App.scss'
import RastreioPage from './pages/rastreio'

const App: FC = (): JSX.Element => {
  return <StyledEngineProvider injectFirst>
    <ThemeProvider theme={appTheme}>
      <ToastContainer
        position='bottom-right'
        autoClose={3250}
        hideProgressBar={false}
        progressStyle={{ background: 'black' }}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Router>
        <Routes>
          <Route element={
            <RouteGuard>
              <Layout />
            </RouteGuard>
          }>
            <Route path='/' element={<IndexPage />} />
            <Route path='/orders' element={<OrdersPage />} />
            <Route path='/payables' element={<PayablePage />} />
            <Route path='/settings' element={<SettingsPage />} />
          </Route>
          <Route path='/login' element={
            <RouteGuard>
              <LoginPage />
            </RouteGuard>
          }/>
          <Route path='/rastreio' element={<RastreioPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  </StyledEngineProvider>
}
  
export default App
