import BlogList from '@/Components/BlogList/BlogList'
import Footer from '@/Components/Footer/Footer'
import Header from '@/Components/Header/Header'
import React from 'react'

export default function page() {
  return (
    <div>
        <Header/>
        <BlogList/>
        <Footer/>
    </div>
  )
}
