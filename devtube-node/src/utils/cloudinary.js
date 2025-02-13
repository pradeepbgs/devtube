import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });


 const uploadOnCloudinary = async (localFilepath)=>{
    try {
        if(!localFilepath) return null;
        // upload the file on cloudinary
       const response = await cloudinary.uploader.upload(localFilepath,{
            resource_type: "auto",
        })
        // file has been uploaded,
        fs.unlinkSync(localFilepath)
        return response
    } catch (error) {
        // remove the locally saved temperory file as the upload operation got failed
        fs.unlinkSync(localFilepath)
        return null;
    }
 }

 const deletOnCloudanry = async (publicId)=>{
    try {
        const response = await cloudinary.uploader.destroy(publicId)
        return response;
    } catch (error) {
        return null;
    } 
   
 }

 const getPublicId = (url) =>{
    const publicId = url.split('/').pop().split('.')[0]
    return publicId; 
 }


 export {
    uploadOnCloudinary,
    deletOnCloudanry,
    getPublicId,
}
