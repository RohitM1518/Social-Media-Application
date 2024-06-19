

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs' //This is the file system from the node js
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
//We get localFilePath from multer middleware
const uploadOnCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath) return null;
        //upload the file on cloudinary
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto" //detects on its own whether it is pdf,image etc
        })
        fs.unlinkSync(localFilePath) 
       // console.log("File is uploaded on cloudinary",response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) 
        return null;
    }
}


export {uploadOnCloudinary}