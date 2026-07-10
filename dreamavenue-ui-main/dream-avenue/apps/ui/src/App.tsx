import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import './index.css'
import { Button } from './components';
 

 

const App = () => {
   
   
  return (
   <div className='container'>
   Hello world
 
   </div>
  )
}
const rootElement = document.getElementById('app')
if (!rootElement) throw new Error('Failed to find the root element')

const root = ReactDOM.createRoot(rootElement as HTMLElement)
root.render(<App />)

// root.render(<Provider store={appReduxStoreService}><App /></Provider>)