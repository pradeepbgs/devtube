// useVideoDetails.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setVideo, setOwner, setSubscribers, isSubscribed, setLikes , setComments} from '../utils/videoSlice';
import { baseCommentUrl, baseVideoUrl } from '../utils/baseUrl';

const useVideoDetails = (videoId) => {
  const dispatch = useDispatch();

  const getVideoDetails = async () => {
    try {
      const response = await axios.get(`${baseVideoUrl}/${videoId}`, { withCredentials: true });

      if (response) {
        const video = response.data.data;
        dispatch(setVideo({ ...video, owner: '', comments: '' }));
        dispatch(setOwner(video.owner));
        dispatch(setSubscribers(video.subscribersCount));
        dispatch(isSubscribed(video.isSubscribed));
        dispatch(setLikes(video.likesCount));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  return { getVideoDetails }; 
};



const useVideoComments = async (videoId) => {
  const dispatch = useDispatch();

  const getVideoComments = async () => {
    try {
      const response = await axios.get(`${baseCommentUrl}/${videoId}`, { withCredentials: true });
      if (response) {
        const comments = response.data.data;
        dispatch(setComments(comments));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  return {getVideoComments}
}










export  {
  useVideoDetails,
  useVideoComments
};
