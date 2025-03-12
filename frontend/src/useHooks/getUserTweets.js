import  axios  from 'axios'
import {addUserTweets} from '../utils/userSlice'
import { baseTweetUrl } from '../utils/baseUrl'


export const getUserTweets = async (dispatch, userId) => {
    try {
        const res = await axios.get(`${baseTweetUrl}/user/${userId}`, {withCredentials: true})
        if(res){
            dispatch(addUserTweets(res.data.data))
            return res;
        }
    } catch (error) {
        console.log(error);
    }
}