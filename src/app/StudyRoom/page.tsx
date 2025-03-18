import Footer from '@/Components/Footer/Footer'
import Header from '@/Components/Header/Header'
import CourseVideoPlayer from '@/Components/StudyRoom/CourseVideoPlayer/CourseVideoPlayer'
import React from 'react'

export default function page() {
  return (
    <div>
          <Header/>
        <CourseVideoPlayer/>
        <Footer/>
    </div>
  )
}
