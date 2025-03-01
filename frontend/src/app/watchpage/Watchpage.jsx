import axios from "axios";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown, FaSave, FaBell } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleMenuFalse } from "../../utils/toggleSlice";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { toggleSubscribe } from "../../useHooks/subscribeToggle";
import VideoPlayer from "./VideoPlayer";
import { toggleLike } from "../../useHooks/likeVideoToggle";
import { decreaseLikes, increaseLikes, setLikes, setVideo } from "../../utils/videoSlice";
import { getTimeElapsed } from "../../utils/getTimeAGo";
import Loader from "../../components/Loader";
import Description from "../../components/Description";
const LazyCommentPage = React.lazy(() => import("./CommentPage"));
import ErrorPage from '../../components/Error'

const Watchpage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('')
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { videoId } = useParams();
  const isDescription = useSelector((state) => state.toggle.description);
  const { Likes, video: Video } = useSelector((state) => state.video);
  const { user } = useSelector((state) => state.auth);
  const channelId = Video?.owner?._id;

  const handleSubscribeToggle = useCallback(() => {
    if (!user) {
      return navigate('/login')
    }
    dispatch(setVideo({
      ...Video,
      isSubscribed: !Video?.isSubscribed,
      subscribersCount: Video?.isSubscribed ? Video.subscribersCount - 1 : Video.subscribersCount + 1
    }));
    toggleSubscribe(channelId, dispatch);
  }, [user, channelId, Video, dispatch]);


  const toggleVideoLike = useCallback(async () => {
    if (user) {
      const res = await toggleLike(videoId);
      if (res?.data?.message === "liked video") {
        dispatch(setVideo({ ...Video, isLiked: true }));
        dispatch(increaseLikes());
      } else {
        dispatch(setVideo({ ...Video, isLiked: false }));
        dispatch(decreaseLikes());
      }
    } else {
      return navigate('/login')
    }
  }, [user, videoId, Video, dispatch]);


  const getVideoDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/v1/videos/${videoId}`, {
        withCredentials: true,
      });

      if (response) {
        const video = response.data.data;
        console.log("Fetched video:", video);
        dispatch(setVideo(video));
        dispatch(setLikes(video?.likesCount));
      }

      if(response.status === 404){
        setError("Video Not Found")
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message ?? "Error while fetching video");
    } finally {
      setIsLoading(false);
    }
  }, [videoId, dispatch]);


  useEffect(() => {
    console.log("videoId changed:", videoId);
    if (videoId) {
      dispatch(setVideo(null)); 
      getVideoDetails();
    }
  }, [videoId]);

  useEffect(() => {
    dispatch(toggleMenuFalse());
  }, [dispatch]);


  if(error){
    return <ErrorPage err={error}/>
  }

  const VideocreatedAGo = getTimeElapsed(Video?.createdAt);

  return (
    <div className="text-white ml-5  flex justify-between">
      <div className="w-[67%] px-2 py-3">
        <div className="px-2">
          {isLoading ? (
            <Loader />
          ) : (
            Video && <VideoPlayer url={Video?.url} />
          )}
        </div>

        {/* {Video && ( */}
          <div className="ml-1 px-1 py-1 mt-1 rounded-md">
            <div className="flex justify-between">
              <div className="w-[90%]">
                <h1 className="text-[1.2rem] font-medium">{Video?.title}</h1>
              </div>
            </div>
            <div className="flex justify-between ">

              {/* Channel details */}
              <div className="flex items-center mt-1">
                <Link to={`/channel/${Video?.owner?.username}`}>
                  <img
                    className="w-8 h-8 rounded-full"
                    src={`${Video?.owner?.avatar}`}
                  />
                </Link>
                <div className="ml-3 font-mono text-[0.8rem]">
                  <Link
                    to={`/channel/${Video?.owner?.username}`}
                    className="font-semibold"
                  >
                    {Video?.owner?.fullname}
                  </Link>
                  <p className="text-gray-300">
                    {Video?.subscribersCount} subscribers
                  </p>
                </div>
                {/* Subscribe button */}
                <button
                  onClick={handleSubscribeToggle}
                  className=" ml-3 py-1 flex items-center border border-gray-700 hover:bg-gray-800 px-1 rounded-md"
                >
                  <p className="mr-3 font-semibold">
                    {Video?.isSubscribed ? "subscribed" : "subscribe"}
                  </p>
                  <FaBell />
                </button>
              </div>

              {/* Like and save button */}
              <div className=" flex h-[30%]">
                <NavLink
                  onClick={toggleVideoLike}
                  className={`rounded-md px-4  border border-gray-400 flex items-center hover:bg-gray-800 ${Video?.isLiked ? "text-blue-500" : ""
                    }`}
                >
                  <p className="mr-2">{Likes}</p>
                  <FaThumbsUp />
                </NavLink>

                <button className="px-4 border border-gray-400 ml-2 flex items-center hover:bg-gray-800 rounded-md">
                  <FaThumbsDown />
                  <p className="ml-2"></p>
                </button>
                <button className="px-4 py-1 border border-gray-400 ml-2 flex items-center hover:bg-gray-800 rounded-md">
                  <FaSave />
                  save
                </button>
              </div>

            </div>

            {/* Description */}
            <div className="bg-[#3b444b] mt-3 rounded-md p-3">
              <Description
                views={Video?.views}
                createdAt={VideocreatedAGo}
                description={Video?.description}
              />
            </div>

          </div>
        {/* )} */}
        <Suspense fallback={<Loader />}>
          <LazyCommentPage />
        </Suspense>

      </div>
      <div className="w-[40%]">
        {/* ( // need more works on this listing page with backend and FE too)
        <VideoListings
          imgWidth="w-[14vw]"
          titleFont="font-semibold"
          titleWidth="w-[20vw]"
          titleSize="text-[1.rem]"
          mainDIvWidth="0"
          imgHeight="h-[9vw]"
          showVideoDescription={false}
          video={video}
        /> */}
      </div>
    </div>
  );
};

export default Watchpage;
