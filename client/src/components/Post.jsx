import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { FcLike } from "react-icons/fc";
import { FaCommentAlt } from "react-icons/fa";


const Post = ({ post }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  const truncateContent = (content, isExpanded) => {
    if (isExpanded) {
      return content;
    }
    const maxLength = 100; // Adjust as needed for two or three lines
    if (content.length > maxLength) {
      return `${content.substring(0, maxLength)}...`;
    }
    return content;
  };

  if (post.format === 'mp4') {
    return (
      <div className="card shadow-xl p-2 font-mono">
        <div className="card-body">
          <h2 className="card-title text-black">{post?.owner[0].username}</h2>
          <p className=' opacity-70'>
            {truncateContent(post.content, isExpanded)}
            {post.content.length > 100 && (
              <button onClick={toggleExpand} className="text-blue-500 ml-2">
                {isExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </p>
          <ReactPlayer
            url={post.file}
            controls
            width="100%"
            height="auto"
            className="w-full h-64 object-cover"
          />
          <div className=' flex items-baseline justify-between px-3'>
          <FcLike style={{width:25, height:25}}/>
          <FaCommentAlt style={{width:20, height:20}}/>
          </div>
        </div>
      </div>
    );
  } else if (post.format === 'png' || post.format === 'jpg') {
    return (
      <div className="card shadow-xl p-3 font-mono">
        <div className="card-body">
          <h2 className="card-title text-black">{post?.owner[0].username}</h2>
          <p className=' opacity-70'>
            {truncateContent(post.content, isExpanded)}
            {post.content.length > 100 && (
              <button onClick={toggleExpand} className="text-blue-500 ml-2">
                {isExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </p>
        </div>
        <img
          src={post.file}
          alt="post"
          className="w-full h-64 object-cover"
        />
        <div className=' flex items-baseline justify-between px-3 my-4'>
          <FcLike style={{width:25, height:25}}/>
          <FaCommentAlt style={{width:20, height:20}}/>
          </div>
      </div>
    );
  } else {
    return <div className="card shadow-xl p-2 font-mono">
    <div className="card-body">
      <h2 className="card-title text-black">{post?.owner[0].username}</h2>
      <p className=' opacity-70'>
        {truncateContent(post.content, isExpanded)}
        {post.content.length > 100 && (
          <button onClick={toggleExpand} className="text-blue-500 ml-2">
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </p>
      <div className=' flex items-baseline justify-between px-3'>
      <FcLike style={{width:25, height:25}}/>
      <FaCommentAlt style={{width:20, height:20}}/>
      </div>
    </div>
  </div> // Handle other formats if needed
  }
};

export default Post;
