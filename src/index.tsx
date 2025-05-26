import React from 'react'
import { createRoot } from 'react-dom/client'

import * as serviceWorker from './serviceWorker'

import { StoreProvider } from './shared/infra/store'

import App from './App'

import './index.css'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <StoreProvider>
    <App />
  </StoreProvider>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
