import React from 'react'
import { Button } from './Button'

const NewPost = () => {
    return (
        <div className=' text-black w-full flex flex-col gap-2'>
            <h1 className=' font-mono text-3xl font-bold'>New Post</h1>
            <label className="form-control w-full">
                <div className="label w-full">
                    <span className="label-text font-mono">Content</span>
                </div>
                <textarea className="textarea textarea-bordered h-24 font-mono bg-white" placeholder="Content"></textarea>
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
                //   onChange={handleFileChange}
                />
            </label>
            <Button style=' w-full bg-black text-white'>Post</Button>
        </div>
    )
}

export default NewPost