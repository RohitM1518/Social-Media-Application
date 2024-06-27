import React from 'react'
import {useNavigate } from 'react-router-dom'

export const Button = ({children,url,style=''}) => {
    const navigate = useNavigate();
    const clickHandle=()=>{
        navigate(url);
    }
  return (
    <div className='m-2 mt-5'>
        <button 
        className={`${style?`${style}`:'bg-black text-white'}  p-2 rounded-md font-mono transition ease-in-out delay-150 lg:hover:-translate-y-1 lg:hover:scale-105 duration-300`}
        onClick={clickHandle}
        >{children}</button>
    </div>
  )
}
