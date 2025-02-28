import  axios  from 'axios'
import {addUserTweets} from '../utils/userSlice'


export const getUserTweets = async (dispatch, userId) => {
    try {
        const res = await axios.get(`/api/v1/tweets/user/${userId}`, {withCredentials: true})
        if(res){
            dispatch(addUserTweets(res.data.data))
            return res;
        }
    } catch (error) {
        console.log(error);
    }
}