import  axios  from 'axios'
import { addVideo } from '../utils/userSlice'




const useUserVideos = async (dispatch , userId) => {
    try {
        const res = await axios.get(`/api/v1/videos/c/${userId}`, {withCredentials: true})
        if(res.data){
            dispatch(addVideo(res.data.data))
        }
        return res;
    } catch (error) {
        console.log(error);
    }
}

export default useUserVideos;