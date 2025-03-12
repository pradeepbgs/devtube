import React, { useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import { toggleMenuTrue } from "../../utils/toggleSlice";
import { addVideos } from "../../utils/videos.slice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ErrorPage from "../../components/Error";
import { baseVideoUrl } from "../../utils/baseUrl";

const VideoContainer = () => {
  const dispatch = useDispatch();
  const { videos } = useSelector((state) => state.videos);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  const getData = async (page) => {
    try {
      setError(""); // Reset error before making a request

      const response = await axios.get(`${baseVideoUrl}?page=${page}`, { withCredentials: true });

      if (response.status === 200 && response?.data?.data?.length > 0) {
        dispatch(addVideos(response?.data?.data));
      } else {
        setError("No more videos available"); // 404 case
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong!");
    }
  };

  useEffect(() => {
    dispatch(toggleMenuTrue());
    getData(page);
  }, [page]);

  if (error) {
    return <ErrorPage err={error} />;
  }

  return (
    <div className="overflow-hidden mt-2">
      <div className="flex flex-wrap md:ml-2">
        {videos?.map((video, index) => (
          <div key={video?._id ?? index}>
            <VideoCard index={index} video={video} />
          </div>
        ))}
        
      </div>
    </div>
  );
};

export default VideoContainer;
