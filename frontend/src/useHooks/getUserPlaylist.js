import axios from "axios";
import {addUserPlaylist} from '../utils/userSlice'

export const usePlayLists = async (dispatch,userId) => {
    
    try {
        const res = await axios.get(`/api/v1/playlists/user/${userId}`, {withCredentials: true})
        
        if(res){
            dispatch(addUserPlaylist(res.data.data))
            return res;
        }
        
    } catch (error) {
    }

}