'use client'

import Navbar from '@/components/Navbar'
import '@/app/globals.css'

function DashboardPage() {
  return (
    <div className='main-content'>
      <Navbar />
      <div className="h-screen">
        <section className="h-[calc(100vh-7rem)] flex justify-center items-center ">
          <div
            className="rounded p-1 max-w-6xl"
          >
            <div className="glass w-80 h-80 rounded-box grid place-content-center">
            </div>
          </div>
        </section >
      </div>
    </div>
  )
}

export default DashboardPage

