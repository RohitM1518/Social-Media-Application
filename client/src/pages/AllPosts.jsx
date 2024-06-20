import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Posts from '../components/Posts'
import { NewPost } from '../components'
const AllPosts = () => {
  const accessToken = useSelector(state=>state.user.accessToken)
  const backendURL = import.meta.env.VITE_BACKEND_URL
  const [posts,setPosts]= useState([])
    useEffect(()=>{
      async function getPosts(){
        try {
            const res = await axios.get(`${backendURL}/post/`,{
              withCredentials:true,
              headers:{
                'Authorization':`Bearer ${accessToken}`
              }
            })
            console.log(res.data.data.posts)
            setPosts(res.data.data.posts)
        } catch (error) {
            console.log(error)
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
    <div className='grid grid-cols-4 gap-4'>
      <div className='col-span-1  p-4'></div>
      <div className='col-span-2 p-4 justify-center'>
      <Posts posts={posts}/>
      </div>
      <div className='col-span-1 p-4 fixed right-10 top-20 h-full overflow-y-auto'>
      <NewPost />
      </div>
    </div>
  )
}

export default AllPosts