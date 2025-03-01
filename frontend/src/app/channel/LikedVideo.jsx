import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import VideoCard from '../videoComponents/VideoCard';
import { addLikedVideos } from '../../utils/userSlice';

const LikedVideo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { userLikedVideos } = useSelector((state) => state.user);

  const fetchLikedVideos = async () => {
    try {
      const response = await axios.get('/api/v1/likes/videos', { withCredentials: true });
      if (response?.data?.data) {
        dispatch(addLikedVideos(response?.data?.data));
        setIsLoading(true);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    if (!userLikedVideos) {
      fetchLikedVideos();
    }
  }, [userLikedVideos]);

  return (
    <div className='text-white flex flex-wrap'>
      {userLikedVideos?.map((video, index) => (
        <div key={index}>
          <VideoCard video={video} />
        </div>
      ))}
    </div>
  );
};

export default LikedVideo;
