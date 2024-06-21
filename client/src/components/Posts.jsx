import React from 'react'
import Post from './Post'

const Posts = ({posts,style}) => {
    console.log("Posts",posts)
  return (
    <div className={` ${style?`${style}`:'flex justify-center flex-col'} `}>
        {
        posts &&
        posts?.map((post)=>(
          <div id={post._id}>
            <Post post={post} />
          </div>
        ))
      }
    </div>
  )
}

export default Posts