import React from 'react'
import Button from '@mui/material/Button';


const ButtonComp = ({text,style, imgPath, imgWidth=25, imgHeight=25,fullStyle='',type="submit"}) => {
  return (
    <>
    <Button className={`${style} flex  border border-white w-full gap-3 justify-center items-baseline max-w-auto`}
    variant='outlined' 
    type={type}
    color='primary'>
    {imgPath && <img src={imgPath} alt="" height={imgHeight} width={imgWidth} className='' />}
    {text}</Button>
    </>
  )
}

export default ButtonComp