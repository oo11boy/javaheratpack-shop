import Footer from '@/Components/Footer/Footer'
import Header from '@/Components/Header/Header'
import DashboardAccount from '@/DashboardComponents/UserAccount/DashboardAccount/DashboardAccount'
import React from 'react'

export default function page() {
  return (
    <div>
        <Header/>
    <DashboardAccount/>
    <Footer/>
    </div>
  )
}
