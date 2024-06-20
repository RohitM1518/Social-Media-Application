import React from 'react'

const Comments = ({comments}) => {
  return (
    <div>
        {
            comments && comments?.map((comment)=>(
                <div className=' flex gap-4 font-mono items-center'>
                    <h4 className=' text-lg'>{comment.owner.username}</h4>
                    <h6 className=' opacity-60 text-sm'>{comment.content}</h6>
                </div>
            ))
        }
    </div>
  )
}

export default Comments