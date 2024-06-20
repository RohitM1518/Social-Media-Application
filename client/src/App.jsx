import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { Snackbar } from '@mui/material'
import { useEffect, useState } from 'react'
import { useResponseContext } from './contexts/ResponseContext'
function App() {
  const {response,setResponse}=useResponseContext()
  
  return (
    <div className=''>
        <Header />
        {response && <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        onClose={setResponse('')}
        message="I love snacks"
        key={vertical + horizontal}
      />}
        <div className='w-full h-36'>
        </div>
        <div className=' container min-h-screen items-center'>
          <Outlet />
        </div>
        <Footer />

    </div>
  )
}

export default App
