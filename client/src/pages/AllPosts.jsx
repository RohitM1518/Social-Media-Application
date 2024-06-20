import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Posts from '../components/Posts'
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
    <div className=' w-1/2'>
      <Posts posts={posts}/>
    </div>
  )
}

export default AllPosts