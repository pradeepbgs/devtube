import axios from "axios";
import { baseCommentUrl } from "../utils/baseUrl";


const useComment = async (userComment, videoId) => {
    try {
        const res = await axios
        .post(`${baseCommentUrl}}/${videoId}`, {content: JSON.stringify(userComment)}, {withCredentials: true})
        return res;
    } catch (error) {
        console.log(error);
    }
}

export  {useComment}