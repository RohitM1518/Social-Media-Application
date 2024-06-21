import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = ({posts,style}) => {
    console.log("Posts",posts)
    const currentUser = useSelector(state=>state.user.currentUser)
  return (
    <div className={` ${style?`${style}`:'flex justify-center flex-col'} `}>
        {
        posts &&
        posts?.map((post)=>(
          <div id={post._id}>
            <Post post={post} isUserPost={(currentUser._id==post?.owner[0]?._id || currentUser._id == post?.owner?._id) ? true:false}/>
          </div>
        ))
      }
    </div>
  )
}

export default Posts