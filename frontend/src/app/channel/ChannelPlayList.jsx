import React, { useEffect, useState } from "react";
import { FaPlayCircle } from "react-icons/fa";
import ChannelPlaylistCard from "./playlist/ChannelPlaylistCard";
import {usePlayLists} from '../../useHooks/getUserPlaylist'
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";

const ChannelPlayList = () => {
    const [isLoadind, setIsLoading]  = useState(true)
  
  const dispatch = useDispatch()
  const {user, userPlaylist} = useSelector(state => state.user)


  useEffect(() => {
    usePlayLists(dispatch, user?._id)
    setIsLoading(false)
  },[user])


   if(isLoadind)
      return <Loader />;

  return userPlaylist && userPlaylist.length > 0 ? (
    <>
       <div className="text-white flex flex-wrap ml-10 py-10">
         {userPlaylist?.map((playlist, index) => (
           <div key={index}><ChannelPlaylistCard playlist={playlist}/></div>
         ))}
       </div>
    </>
    ) : (

    <div className="mt-5 flex flex-col items-center">
      <FaPlayCircle className="text-5xl" />
      <h1 className="font-bold mt-2 mb-3">No playlist created</h1>
      <p className="font-semibold">
        There are no playlist created on this channel.
      </p>
    </div>

  );
};

export default ChannelPlayList;
