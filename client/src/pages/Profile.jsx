import React, { useEffect ,useState} from 'react'
import { useParams } from 'react-router-dom'
import { errorParser } from '../utils/errorParser'
import { useErrorContext } from '../contexts/ErrorContext'
import { useUserContext } from '../contexts/UserContext'

const Profile = () => {
    const {id} = useParams()
    const [posts,setPosts]=useState([])
    const {setError}= useErrorContext()
    const {user}=useUserContext()
    useEffect(() => {
        const getUserPosts = async () => {
            try {
                if(!id) return null
                const res = await axios.get(`${backendURL}/post//user${id}`, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                console.log(res.data.data)
                setPosts(res.data.data)
            } catch (error) {
                setError(errorParser(error))
                console.log(error)
            }
        }
        getUserPosts()
    }, [id])
  return (
    <div>
        

    </div>
  )
}

export default Profile