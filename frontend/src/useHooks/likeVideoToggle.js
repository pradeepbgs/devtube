import axios from "axios";
import { baseLikeUrl } from "../utils/baseUrl";

export const toggleLike = async (videoId) => {
    try {
        const res = await axios.post(`${baseLikeUrl}/toggle/v/${videoId}`,{}, {withCredentials: true})
        return res;
    } catch (error) {
        console.log(error);
    }
}