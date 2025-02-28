import axios from "axios"
import { isSubscribed } from "../utils/videoSlice"

const toggleSubscribe = async (channelId, dispatch) => {
    


    try {
        const response = await axios.post(
          `/api/v1/subscriptions/c/${channelId}`,
          null, // Set the request payload to null since it's a POST request
          { withCredentials: true }
        );
          if(response.data.message === "subscribed successfully"){
            dispatch(isSubscribed(true))
          }else if(response.data.message === "unsubscribed successfully"){
            dispatch(isSubscribed(false))
          }
      } catch (error) {
        console.error('Error:', error);
      }

}

export {
    toggleSubscribe
};