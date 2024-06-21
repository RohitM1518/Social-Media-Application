import React from 'react'
import { useNavigate } from 'react-router-dom'
// import logo from '../assets/logo.svg'

const Logo = () => {
    const navigate = useNavigate()
  return (
    <div className='flex gap-1 items-center hover:cursor-pointer' onClick={()=>navigate('/')}>
        {/* <img src={logo} alt="Logo" width={40} height={20} className='flex' /> */}
        <h1 className=' inline-block text-black font-extrabold font-mono text-2xl'>FomoFeed</h1>
    </div>
  )
}

export default Logo