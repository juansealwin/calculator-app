// src/index.tsx
import React from 'react'
import ReactDOM from 'react-dom'
import CalculatorApp from './App'
import { QueryClient, QueryClientProvider } from 'react-query'


const queryClient = new QueryClient()

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CalculatorApp />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
)