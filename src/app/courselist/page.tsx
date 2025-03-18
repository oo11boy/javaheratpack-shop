import CourseList from '@/Components/CourseList/CourseList'
import Footer from '@/Components/Footer/Footer'
import Header from '@/Components/Header/Header'
import React from 'react'

export default function page() {
  return (
    <div>
      <Header/>
      <CourseList/>
      <Footer/>
    </div>
  )
}
