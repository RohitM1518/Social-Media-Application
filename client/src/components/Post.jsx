import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { FcLike } from "react-icons/fc";
import { FaCommentAlt } from "react-icons/fa";
import { Button } from './Button';
import { MdCancelPresentation } from "react-icons/md";
import { useSelector } from 'react-redux';
import axios from 'axios';
import Comments from './Comments';
import { FaRegHeart } from "react-icons/fa6";


const Post = ({ post }) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL
    const accessToken = useSelector(state => state.user?.accessToken)
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [logic,setLogic]=useState('')
    const [isLiked,setIsLiked]=useState(false)
    const postComment = async () => {
        try {
            setLogic('rohit')
            const res = await axios.post(`${backendURL}/comment/${post._id}`,{content:newComment}, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            console.log(res.data.data)            
        } catch (error) {
            console.log(error)
        }
    }
    const toggleLike = async () => {
        try {
            setIsLiked(prev => !prev)
            const res = await axios.post(`${backendURL}/like/${post._id}`,{}, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            console.log(res.data.data)            
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await axios.get(`${backendURL}/comment/${post._id}`, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                const res1 = await axios.get(`${backendURL}/like/${post._id}`, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                console.log(res1.data.data)
                setComments(res.data.data)
            } catch (error) {
                console.log(error)
            }
        }
        getComments()
    }, [post,setLogic])
   
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = () => setIsExpanded(!isExpanded);
    const [showComment, setShowComment] = useState(false)
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
                        {isLiked &&<div onClick={toggleLike} className=' hover:cursor-pointer'>
                        <FcLike style={{ width: 25, height: 25}} />
                        </div>}
                        {!isLiked &&<div onClick={toggleLike} className=' hover:cursor-pointer'>
                        <FaRegHeart style={{ width: 25, height: 25}} />
                        </div>}
                        {!showComment && <div className=' hover:cursor-pointer'>
                            <FaCommentAlt style={{ width: 20, height: 20 }} onClick={() => setShowComment(true)} />
                        </div>}
                        {showComment &&
                            <div className=' hover:cursor-pointer'>
                                <MdCancelPresentation style={{ width: 20, height: 20 }} onClick={() => setShowComment(false)} />
                            </div>}
                    </div>
                        {
                            showComment && <Comments comments={comments} />
                        }
                    {showComment && <div className='flex items-baseline justify-between'>
                        <input type="text" placeholder="Comment" className="input input-bordered w-full" onChange={e=>setNewComment(e.target.value)}/>
                        <div onClick={postComment}>
                        <Button>Send</Button>
                        </div>
                    </div>}
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
                <div className=' flex items-baseline justify-between p-3'>
                {isLiked &&<div onClick={toggleLike} className=' hover:cursor-pointer'>
                        <FcLike style={{ width: 25, height: 25}} />
                        </div>}
                        {!isLiked &&<div onClick={toggleLike} className=' hover:cursor-pointer'>
                        <FaRegHeart style={{ width: 25, height: 25}} />
                        </div>}
                        {!showComment && <div className=' hover:cursor-pointer'>
                            <FaCommentAlt style={{ width: 20, height: 20 }} onClick={() => setShowComment(true)} />
                        </div>}
                        {showComment &&
                            <div className='hover:cursor-pointer'>
                                <MdCancelPresentation style={{ width: 20, height: 20 }} onClick={() => setShowComment(false)} />
                            </div>}
                    </div>
                        {
                            showComment && <Comments comments={comments} />
                        }
                    {showComment && <div className=' flex items-baseline justify-between'>
                        <input type="text" placeholder="Comment" className="input input-bordered w-full" onChange={e=>setNewComment(e.target.value)}/>
                        <div onClick={postComment}>
                        <Button>Send</Button>
                        </div>
                    </div>}
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
                <div className=' flex items-baseline justify-between p-3 '>
                {isLiked &&<div onClick={toggleLike} className=' hover:cursor-pointer'>
                        <FcLike style={{ width: 25, height: 25}} />
                        </div>}
                        {!isLiked &&<div onClick={toggleLike} className=' hover:cursor-pointer'>
                        <FaRegHeart style={{ width: 25, height: 25}} />
                        </div>}
                        {!showComment && <div className=' hover:cursor-pointer'>
                            <FaCommentAlt style={{ width: 20, height: 20 }} onClick={() => setShowComment(true)} />
                        </div>}
                        {showComment &&
                            <div className=' hover:cursor-pointer'>
                                <MdCancelPresentation style={{ width: 20, height: 20 }} onClick={() => setShowComment(false)} />
                            </div>}
                    </div>
                        {
                            showComment && <Comments comments={comments} />
                        }
                    {showComment && <div className=' flex items-baseline justify-between'>
                        <input type="text" placeholder="Comment" className="input input-bordered w-full" onChange={e=>setNewComment(e.target.value)}/>
                        <div onClick={postComment}>
                        <Button>Send</Button>
                        </div>
                    </div>}
            </div>
        </div> // Handle other formats if needed
    }
};

export default Post;
