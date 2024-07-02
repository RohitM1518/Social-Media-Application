import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { FcLike } from 'react-icons/fc';
import { FaCommentAlt } from 'react-icons/fa';
import { Button } from './Button';
import { MdCancelPresentation, MdOutlineCancel } from 'react-icons/md';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Comments from './Comments';
import { FaRegHeart } from 'react-icons/fa';
import { useErrorContext } from '../contexts/ErrorContext';
import { useResponseContext } from '../contexts/ResponseContext';
import { errorParser } from '../utils/errorParser';
import { format } from 'timeago.js';
import { BsThreeDotsVertical } from 'react-icons/bs';
import NewPost from './NewPost';
import { useNavigate } from 'react-router-dom';
import { useLoadingContext } from '../contexts/LoadingContext';

const Post = ({ post, isUserPost = false }) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const accessToken = useSelector(state => state.user?.accessToken);
  const { setError } = useErrorContext();
  const { setResponse } = useResponseContext();
  const navigate = useNavigate()
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [logic, setLogic] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const {setIsLoading}=useLoadingContext()
  const postComment = async () => {
    try {
      setIsLoading(true)
      const res = await axios.post(
        `${backendURL}/comment/${post?._id}`,
        { content: newComment },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      setResponse(res.data.message);
      console.log(res.data.data);
      // navigate('/')
      // setTimeout(()=>{
      //   navigate('/posts')
      // },100)
      setNewComment('')
    } catch (error) {
      setError(errorParser(error));
      console.log(error);
    }
    finally{
      setIsLoading(false)
    }
  };

  const toggleLike = async () => {
    try {
      const res = await axios.post(
        `${backendURL}/like/${post._id}`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      setIsLiked(prev => !prev);
      console.log(res.data.data);
    } catch (error) {
      setError(errorParser(error));
      console.log(error);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const commentsRes = await axios.get(`${backendURL}/comment/${post._id}`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const likesRes = await axios.get(`${backendURL}/like/${post._id}`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setIsLiked(likesRes.data.data);
        setComments(commentsRes.data.data);
      } catch (error) {
        setError(errorParser(error));
        console.log(error);
      }
    };
    getComments();
  }, [post, setLogic]);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const truncateContent = (content, isExpanded) => {
    const maxLength = 100;
    if (isExpanded || content.length <= maxLength) {
      return content;
    }
    return `${content.substring(0, maxLength)}...`;
  };
  const deletePost=async()=>{
    try {
      setIsLoading(true)
        const confirmDelete = window.confirm('Are you sure you want to delete this post?');
        if (!confirmDelete){
            return
        } 
        const res = await axios.delete(`${backendURL}/post/${post._id}`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        navigate("/")
        setTimeout(()=>{
            navigate("/posts")
            setResponse(res.data.message)
        },10)
        
        console.log("Data ",res.data)
    } catch (error) {
        setError(errorParser(error))
        console.log(error)
    }
    finally{
      setIsLoading(false)
    }
}

  return (
    <div className="card shadow-xl p-2 font-mono">
      <div className="card-body">
        <div className="flex justify-between">
          <h2 className="card-title text-black hover:cursor-pointer" onClick={()=>navigate(`/profile/${post?.owner[0]?._id || post?.owner?._id}`)}>{post?.owner[0]?.username || post?.owner?.username}</h2>
          {!isUserPost && <h6>{format(post.createdAt)}</h6>}
          {isUserPost && (
            <div className="flex">
              <div onClick={() => setToggleMenu(prev => !prev)} className="flex">
                {toggleMenu && (
                  <ul className="flex flex-col gap-2 shadow-md p-1 justify-center items-center">
                    <li className="hover:bg-green-300 rounded-sm px-1 hover:cursor-pointer" onClick={() => setIsUpdate(prev => !prev)}>
                      {isUpdate ? 'Cancel Update' : 'Update Post'}
                    </li>
                    <li className="hover:bg-red-300 rounded-sm hover:cursor-pointer" onClick={deletePost}>Delete Post</li>
                  </ul>
                )}
                {!toggleMenu && !isUpdate && (
                  <div className="hover:cursor-pointer">
                    <BsThreeDotsVertical style={{ width: 25, height: 25 }} />
                  </div>
                )}
                {toggleMenu &&(
                  <div className="hover:cursor-pointer">
                    <MdOutlineCancel style={{ width: 25, height: 25 }} />
                  </div>
                )}
                {isUpdate &&(
                  <div className="hover:cursor-pointer" onClick={()=>setIsUpdate(false)}>
                    <MdOutlineCancel style={{ width: 25, height: 25 }} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {!isUpdate && (
          <div>
            <p className="opacity-70">
              {truncateContent(post.content, isExpanded)}
              {post.content.length > 100 && (
                <button onClick={toggleExpand} className="text-blue-500 ml-2">
                  {isExpanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </p>
            {post.format === 'mp4' && (
              <ReactPlayer url={post.file} controls width="100%" height="auto" className="w-full h-64 object-cover" />
            )}
            {(post.format === 'png' || post.format === 'jpg') && (
              <img src={post.file} alt="post" className="w-full h-64 object-cover" />
            )}
            <div className="flex items-center justify-between px-3 mt-2">
              {isLiked ? (
                <div onClick={toggleLike} className="hover:cursor-pointer">
                  <FcLike style={{ width: 25, height: 25 }} />
                </div>
              ) : (
                <div onClick={toggleLike} className="hover:cursor-pointer">
                  <FaRegHeart style={{ width: 25, height: 25 }} />
                </div>
              )}
              {!showComment && (
                <div className="hover:cursor-pointer">
                  <FaCommentAlt style={{ width: 20, height: 20 }} onClick={() => setShowComment(true)} />
                </div>
              )}
              {showComment && (
                <div className="hover:cursor-pointer">
                  <MdCancelPresentation style={{ width: 20, height: 20 }} onClick={() => setShowComment(false)} />
                </div>
              )}
            </div>
            {showComment && <Comments comments={comments} />}
            {showComment && (
              <div className="flex items-baseline justify-between">
                <input type="text" placeholder="Comment" className="input input-bordered w-full" value={newComment} onChange={e => setNewComment(e.target.value)} />
                <div onClick={postComment}>
                  <Button>Send</Button>
                </div>
              </div>
            )}
          </div>
        )}
        {isUpdate && (
          <div>
            <NewPost heading="Update" cont={post?.content} postid={post._id}/>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
