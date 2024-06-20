import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { Snackbar } from '@mui/material'
import { useEffect, useState } from 'react'
import { useResponseContext } from './contexts/ResponseContext'
import { useErrorContext } from './contexts/ErrorContext'
function App() {
  const { response, setResponse } = useResponseContext()
  const {error,setError}=useErrorContext()
  if(error){
    setTimeout(()=>{
      setError('')
    },5000)
  }
  if(response){
    setTimeout(()=>{
      setResponse('')
    },5000)
  }

  return (
    <div className=''>
      <Header />
      {response && <div className="toast toast-bottom toast-start z-20">
        <div className="alert bg-green-400">
          <span>{response}</span>
        </div>
      </div>}
      {error && <div className="toast toast-bottom toast-start z-20">
        <div className="alert bg-red-400">
          <span>{error}</span>
        </div>
      </div>}
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
