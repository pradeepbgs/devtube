import axios from "axios";
import {addUserPlaylist} from '../utils/userSlice'
import { basePlayListUrl } from "../utils/baseUrl";

export const usePlayLists = async (dispatch,userId) => {
    
    try {
        const res = await axios.get(`${basePlayListUrl}/user/${userId}`, {withCredentials: true})
        
        if(res){
            dispatch(addUserPlaylist(res.data.data))
            return res;
        }
        
    } catch (error) {
    }

}