import React from 'react'
import Post from './Post'

const Posts = ({posts}) => {
    console.log("Posts",posts)
  return (
    <div className=' w-full'>
        {
        posts &&
        posts.map((post)=>(
          <div id={post._id}>
            <Post post={post} />
          </div>
        ))
      }
    </div>
  )
}

export default Posts