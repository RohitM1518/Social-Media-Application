import React, { useEffect ,useState} from 'react'
import { useParams } from 'react-router-dom'
import { errorParser } from '../utils/errorParser'
import { useErrorContext } from '../contexts/ErrorContext'
import { useUserContext } from '../contexts/userContext'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Button, NewPost } from '../components'
import Posts from '../components/Posts'
import { useResponseContext } from '../contexts/ResponseContext'
import { useLoadingContext } from '../contexts/LoadingContext'

const Profile = () => {
    const {id} = useParams()
    const [posts,setPosts]=useState([])
    const [type,setType]=useState('myposts')
    const {setError}= useErrorContext()
    const {user,setUser}=useUserContext()
    const {setResponse}=useResponseContext()
    const [isChangePassword,setIsChangePassword]=useState(false)
    const [newPassword,setNewPassword]=useState('')
    const [oldPassword,setOldPassword]=useState('')
    const currentUser = useSelector(state => state?.user?.currentUser)
    const backendURL = import.meta.env.VITE_BACKEND_URL
    const accessToken = useSelector(state=>state?.user?.accessToken)
    const {setIsLoading}=useLoadingContext()

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
    const changePassword=async()=>{
        try {
            setIsLoading(true)
            const confirmDelete = window.confirm('Are you sure you want to change the password?');
            if (!confirmDelete){
                return
            } 
            const res = await axios.patch(`${backendURL}/user/`,{oldPassword:oldPassword,newPassword:newPassword}, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            setResponse(res.data.message)
            console.log("Data ",res.data)
        } catch (error) {
            setError(errorParser(error))
            console.log(error)
        }
        finally{
            setIsLoading(false)
        }
    }
    useEffect(() => {
        const getUserPosts = async () => {
            try {
                if(!id) return null
                
                if(id==currentUser._id){
                    setUser(currentUser)
                }
                else{
                    const res = await axios.get(`${backendURL}/user/${id}`, {
                        withCredentials: true,
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    })
                    console.log(res.data.data)
                    setUser(res.data.data)
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
                {
                    isChangePassword && <div className=' flex flex-col gap-2 mt-4'>
                        <div>
                        <input type="password" placeholder="Old Password" onChange={(e)=>setOldPassword(e.target.value)} className="input input-bordered w-full max-w-xs bg-white" />
                        </div>
                        <div>
                        <input type="password" placeholder="New Password" onChange={(e)=>setNewPassword(e.target.value)} className="input input-bordered w-full max-w-xs bg-white" />
                        </div>
                    </div>
                }
                <div className=' flex'>
                {!isChangePassword && id == currentUser._id && <div onClick={()=>setIsChangePassword(true)}>
                <Button style=' bg-white text-black border'>Change Password</Button>
                </div>}
                {isChangePassword && <div onClick={changePassword}>
                <Button style=''>Change Password</Button>
                </div>}
                {isChangePassword && <div onClick={()=>setIsChangePassword(false)}>
                <Button style=' bg-white text-black border'>Cancel</Button>
                </div>}
                </div>
                </div>
                {id == currentUser._id && <div className='max-w-50'>
                <NewPost />
                </div>}
                
            </div>
        }
        <div className=' flex justify-center mt-8 mb-3'>
            <ul className=' flex gap-5 items-center'>
                <li className= {`${type=='myposts'?' font-bold text-lg':''} hover:cursor-pointer hover:font-bold`} onClick={handleMyPosts}>{id == currentUser._id?'My':'User'} Posts</li>
                {id == currentUser._id?<li className= {`${type=='likedposts'?' font-bold text-lg':''} hover:cursor-pointer hover:font-bold`} onClick={handleLikedPosts}>Liked Posts</li>:null}
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