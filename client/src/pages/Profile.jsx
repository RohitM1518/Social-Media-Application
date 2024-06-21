import React, { useEffect ,useState} from 'react'
import { useParams } from 'react-router-dom'
import { errorParser } from '../utils/errorParser'
import { useErrorContext } from '../contexts/ErrorContext'
import { useUserContext } from '../contexts/UserContext'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { NewPost } from '../components'
import Posts from '../components/Posts'

const Profile = () => {
    const {id} = useParams()
    const [posts,setPosts]=useState([])
    const [type,setType]=useState('myposts')
    const {setError}= useErrorContext()
    const {user,setUser}=useUserContext()
    const currentUser = useSelector(state => state?.user?.currentUser)
    const backendURL = import.meta.env.VITE_BACKEND_URL
    const accessToken = useSelector(state=>state?.user?.accessToken)
    const handleMyPosts=async()=>{
        setType('myposts')
        try {
            const res = await axios.get(`${backendURL}/post/user/${id}`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            setPosts(res.data.data.posts)
            console.log(res.data.data)
        } catch (error) {
            setError(errorParser(error))
            console.log(error)
        }
    }
    const handleLikedPosts=async()=>{
        setType('likedposts')
        try {
            const res = await axios.get(`${backendURL}/like/`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            setPosts(res.data.data)
            console.log(res.data.data)
        } catch (error) {
            setError(errorParser(error))
                console.log(error)
        }
    }
    useEffect(() => {
        const getUserPosts = async () => {
            try {
                if(!id) return null
                
                if(id==currentUser._id){
                    setUser(currentUser)
                }
                // console.log(user)
                const res = await axios.get(`${backendURL}/post/user/${id}`, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                console.log("Data ",res.data.data.posts)
                setPosts(res.data.data.posts)
            } catch (error) {
                setError(errorParser(error))
                console.log(error)
            }
        }
        getUserPosts()
    }, [id])
  return (
    <div>
        {
            user && <div className=' text-black flex w-full gap-10 justify-around items-center max-lg:flex-col border py-2'>
                <div>
                <h1 className='text-5xl font-mono font-bold'>{user.username}</h1>
                <h4>{user.email}</h4>
                </div>
                <div className='max-w-50'>
                <NewPost />
                </div>
                
            </div>
        }
        <div className=' flex justify-center mt-8 mb-3'>
            <ul className=' flex gap-5 items-center'>
                <li className= {`${type=='myposts'?' font-bold text-lg':''} hover:cursor-pointer`} onClick={handleMyPosts}>{id == currentUser._id?'My':'User'} Posts</li>
                {id == currentUser._id?<li className= {`${type=='likedposts'?' font-bold text-lg':''} hover:cursor-pointer`} onClick={handleLikedPosts}>Liked Posts</li>:null}
            </ul>
        </div>
        <div className=' h-[1px] bg-black'></div>
        <div className=' flex justify-center'>
            {posts && <Posts posts={posts} style=' grid grid-cols-3 gap-5 items-center justify-start max-lg:grid-cols-1'/>}
        </div>
    </div>
  )
}

export default Profile