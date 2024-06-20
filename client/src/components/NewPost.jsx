import React, { useState } from 'react'
import { Button } from './Button'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useErrorContext } from '../contexts/ErrorContext';
import { useResponseContext } from '../contexts/ResponseContext';
import { errorParser } from '../utils/errorParser';

const NewPost = () => {
    const [content,setContent]= useState('')
    const [selectedFile, setSelectedFile] = useState(null);
    const {setError}= useErrorContext()
    const {setResponse}=useResponseContext()
    const backendURL = import.meta.env.VITE_BACKEND_URL
    const accessToken = useSelector(state=>state.user?.accessToken)
    const createPost = async()=>{
        try {
            const formdata = new FormData()
            formdata.append('PostFile',selectedFile)
            formdata.append('content',content)
            const res = await axios.post(`${backendURL}/post/`,formdata,{
                withCredentials:true,
                headers:{
                    'Authorization':`Bearer ${accessToken}`
                }
            })
            setResponse(res.data.message)
            console.log("Success")
        } catch (error) {
            const errorMSg = errorParser(error)
            setError(errorMSg)
            console.log(error)
        }
    }
    return (
        <div className=' text-black w-full flex flex-col gap-2'>
            <h1 className=' font-mono text-3xl font-bold'>New Post</h1>
            <label className="form-control w-full">
                <div className="label w-full">
                    <span className="label-text font-mono">Content</span>
                </div>
                <textarea className="textarea textarea-bordered h-24 font-mono bg-white" placeholder="Content" onChange={(e)=>setContent(e.target.value)}></textarea>
            </label>
            <label
                htmlFor="fileInput"
                className=" cursor-pointer flex bg-white rounded-lg shadow-md border-2 border-gray-300 hover:border-gray-500 px-1 py-2 transition duration-300 ease-in-out"
            >
                <input
                    //   ref={inputRef}
                    id="fileInput"
                    type="file"
                    accept="image/*,video/mp4"
                    className=" mt-6"
                  onChange={e=>setSelectedFile(e.target.files[0])}
                />
            </label>
            <div onClick={createPost}>
            <Button style=' w-full bg-black text-white'>Post</Button>
            </div>
        </div>
    )
}

export default NewPost