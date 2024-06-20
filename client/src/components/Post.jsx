import React from 'react'

const Post = ({post}) => {
    console.log(post.format)
if(post.format == 'mp4'){
    return <div>

    </div>
}
else if(post.format=='png' || post.format=='jpg'){
    return <div className="card w-96 h-1/5 shadow-xl p-3">
    <div className="card-body">
      <h2 className="card-title text-black">{post?.owner[0].username}</h2>
      <p>{post.content}</p>
    </div>
    <img src={post.file} className=' object-cover'/>
  </div>
}
}

export default Post