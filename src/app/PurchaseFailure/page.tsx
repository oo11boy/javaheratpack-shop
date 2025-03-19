import Footer from '@/Components/Footer/Footer'
import Header from '@/Components/Header/Header'
import PurchaseFailure from '@/Components/PurchaseFailure/PurchaseFailure'
import React from 'react'

export default function page() {
  return (
    <>
    <Header/>
    <PurchaseFailure
    errorMessage="خطا در اتصال به درگاه پرداخت."

  />
  <Footer/>
  </>
  )
}
