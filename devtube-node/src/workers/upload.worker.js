import { parentPort , workerData} from "worker_threads";
import {uploadOnCloudinary} from '../utils/cloudinary.js'

 const uploadWorker = async () => {
    try {
        const { videoFile, thumbnail , avatarLocalpath, coverImageLocalpath} = workerData;

        let video;
        if (videoFile) {
            video = await uploadOnCloudinary(videoFile);
        }

        let thumbnailUrl;
        if (thumbnail) {
            thumbnailUrl = await uploadOnCloudinary(thumbnail);
        }

        let avatar;
        if(avatarLocalpath){
            avatar = await uploadOnCloudinary(avatarLocalpath);
        }

        let coverImage;
        if(coverImageLocalpath){
            coverImage = await uploadOnCloudinary(coverImageLocalpath);
        }
        
        parentPort.postMessage({ video, thumbnailUrl , avatar, coverImage});
    } catch (error) {
        parentPort.postMessage({ error: error.message });
    }
}

uploadWorker();