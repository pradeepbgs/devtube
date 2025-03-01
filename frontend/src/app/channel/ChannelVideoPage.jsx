import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaVideo } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { addVideo } from '../../utils/userSlice';
import axios from 'axios';
import VideoCard from '../videoComponents/VideoCard';
import Loader from '../../components/Loader';

const ChannelVideoPage = () => {
  const dispatch = useDispatch();
  const { userVideo, user } = useSelector((state) => state.user);
  const authUser = useSelector((state) => state.auth.user);
  const { username } = useParams();
  const [isLoadind, setIsLoading]  = useState(true)

  const getUserVideos = async () => {
    try {
      const res = await axios.get(
        `/api/v1/videos/c/${user?._id}`,
        { withCredentials: true }
      );
      if (res) {
        dispatch(addVideo(res.data.data));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getUserVideos();
    setIsLoading(false)
  }, [username, user]);

  if(isLoadind)
    return <Loader />;

  return userVideo?.length > 0 ? (
    <div className=''>
      <div className='text-white flex mt-1 flex-wrap'>
        {userVideo?.map((video, index) => (
          <div key={index}>
            <VideoCard video={video} />
          </div>
        ))}
      </div>
      {authUser?._id === user?._id && (
        <div className='flex justify-center'>
          <Link to={`/channel/${user?._id}/upload`} className='px-5 bg-purple-600 mt-4 text-[1.5rem]'>+ upload</Link>
        </div>
      )}

    </div>
  ) : (
    <div className='flex flex-col items-center mt-5'>
      <FaVideo className='text-4xl' />
      <h1 className='font-bold text-2xl'>No Videos Uploaded</h1>
      <p className='w-[70%] mt-3 font-semibold'>This page has yet to upload a video. Search another page in order to find more videos.</p>
      {authUser?._id === user?._id && (
        <div>
          <Link to={`/channel/${user?._id}/upload`} className='px-5 bg-purple-600 mt-4 text-[1.5rem]'>+ upload</Link>
        </div>
      )}
    </div>
  );
};

export default React.memo(ChannelVideoPage);
