import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });


 const uploadOnCloudinary = async (localFilepath:string)=>{
    try {
        if(!localFilepath) return null;
       const response = await cloudinary.uploader.upload(localFilepath,{
            resource_type: "auto",
        })
        return response
    } catch (error) {
        return null;
    }
 }

 const deletOnCloudanry = async (publicId:string)=>{
    try {
        const response = await cloudinary.uploader.destroy(publicId)
        return response;
    } catch (error) {
        return null;
    } 
   
 }

 const getPublicId = (url:any) =>{
    const publicId = url.split('/').pop().split('.')[0]
    return publicId; 
 }


 export {
    uploadOnCloudinary,
    deletOnCloudanry,
    getPublicId,
}
