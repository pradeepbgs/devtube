import React from "react";
import { Link } from "react-router-dom";

const formatDuration = (duration) => {
  const seconds = Math.floor(duration % 60);
  const minutes = Math.floor((duration / 60) % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')} minutes`;
};

const VideoCard = ({ video }) => {
  const formattedDuration = formatDuration(video?.duration);
  return (
    <div className="md:w-[25vw] w-[90vw] rounded ml-5 mb-3 mt-2 text-white">
      <Link to={`/watchpage/${video?._id}`}>
        <img
          src={video?.thumbnail}
          alt={`Thumbnail for ${video?.title}`}
          className="w-full h-[14vw] object-cover mb-2 rounded-xl border border-gray-800"
        />
      </Link>
      <div className="flex">
        <Link to={`/channel/${video?.owner?.username}`}>
          <img
            className="w-9 h-9 object-fit bg-gray-100 rounded-full"
            src={video?.owner?.avatar ?? 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png'}
            alt={`Avatar for ${video?.owner?.fullname}`}
          />
        </Link>
        <div className="ml-4">
          <h2 className="text-md font-semibold">{video?.title}</h2>
          <h2 className="text-gray-200">{video?.owner?.username}</h2>
          <p className="text-gray-300 text-[0.95rem]">{`${video?.views} views • ${formattedDuration}`}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
