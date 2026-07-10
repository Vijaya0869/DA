import React, { createContext, Suspense, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthRoutes from 'auth/AuthRoutes'
import PropertyRoutes from 'property/PropertyRoutes'

import WebRoutes from 'website/WebRoutes'
import Layout from './components/layout';
import Dashboard from './features/dashboard/dashboard';
import './index.scss'


const App = () => {

  return <><Router>
    <Routes>

      <Route

        element={<Layout />

        }
      >
       

        {PropertyRoutes()}

      </Route>
    </Routes>
    <AuthRoutes />
    <WebRoutes />
  </Router></>
}
const rootElement = document.getElementById('app')
if (!rootElement) throw new Error('Failed to find the root element')

const root = ReactDOM.createRoot(rootElement as HTMLElement)

root.render(<App />)