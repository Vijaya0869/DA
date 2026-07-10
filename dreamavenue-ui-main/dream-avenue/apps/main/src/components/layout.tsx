import React from 'react'
import {Sidebar,Header} from 'container/components'
import { Outlet } from 'react-router-dom'

type Props = {}

const Layout = (props: Props) => {
  return (
    <div className='flex flex-row'>
        <Sidebar/>
        <div className='flex flex-col w-full'>
        <Header/>
        <div>
        <Outlet/>
        </div>
        </div></div>
  )
}

export default Layout