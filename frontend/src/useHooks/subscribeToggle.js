import axios from "axios"
import { isSubscribed } from "../utils/videoSlice"
import { baseSubscriptionUrl } from "../utils/baseUrl";

const toggleSubscribe = async (channelId, dispatch) => {
    


    try {
        const response = await axios.post(
          `${baseSubscriptionUrl}/c/${channelId}`,
          null,
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