  import React from 'react'
  import ReactDOM from 'react-dom/client'
 
  import './index.scss'

   import './index.css'
  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WebRoutes from './WebRoutes';
 
 
 

  const App = () => {
  

  
  
  
    return (<>
  {/* <Button>Welcome</Button>
  <InputField type='search'/> */}
  <Router>
    <WebRoutes/>
          {/* <Routes>
            <Route path="/" element={<Login />} />
            </Routes> */}
            </Router>
  </>
    )
  }
  const rootElement = document.getElementById('app')
  if (!rootElement) throw new Error('Failed to find the root element')

  const root = ReactDOM.createRoot(rootElement as HTMLElement)

  root.render(<App />)