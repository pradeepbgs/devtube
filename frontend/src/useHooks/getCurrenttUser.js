import axios from "axios";
import { addCurrentUser } from "../utils/userSlice";
import { baseUserUrl } from "../utils/baseUrl";

export const getCurrentUser = async (dispatch) => {
    try {
        const res = await axios.get(`${baseUserUrl}/current-user`, {withCredentials: true});
        if (res?.data?.data) {
            dispatch(addCurrentUser(res.data.data))
            return res;
        }
    } catch (error) {
        console.log(error);
    }
}