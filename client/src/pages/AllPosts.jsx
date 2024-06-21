import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Posts from '../components/Posts'
import { NewPost } from '../components'
import { useErrorContext } from '../contexts/ErrorContext'
import { useResponseContext } from '../contexts/ResponseContext'
import { errorParser } from '../utils/errorParser'
const AllPosts = () => {
  const accessToken = useSelector(state=>state.user.accessToken)
  const backendURL = import.meta.env.VITE_BACKEND_URL
  const [posts,setPosts]= useState([])
  const {setError} = useErrorContext()
  const {setResponse}=useResponseContext()
    useEffect(()=>{
      async function getPosts(){
        try {
            const res = await axios.get(`${backendURL}/post/`,{
              withCredentials:true,
              headers:{
                'Authorization':`Bearer ${accessToken}`
              }
            })
            // setResponse(res.data.message)
            console.log(res.data.data.posts)
            setPosts(res.data.data.posts)
        } catch (error) {
            console.log(error)
            setError(errorParser(error))
        }
    }
    getPosts()
  } ,[])

  if(!posts){
    return (
      <div>Loading...</div>
    )
  }
  return (
    <div className='grid grid-cols-4 gap-4 max-lg:flex max-lg:flex-col-reverse max-lg:grid-cols-2'>
      <div className='col-span-1  p-4 max-lg:hidden flex-shrink'></div>
      <div className='col-span-2 p-4 justify-center'>
      <Posts posts={posts}/>
      </div>
      <div className='col-span-1 p-4 lg:fixed right-10 top-20 h-full overflow-y-auto max-sm:px-5'>
      <NewPost />
      </div>
    </div>
  )
}

export default AllPosts