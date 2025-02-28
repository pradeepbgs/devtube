import React from "react";
import { Link } from "react-router-dom";

const VideoListings = ({
  imgWidth = "w-[18vw]",
  imgHeight = "h-[11vw]",
  mainDivWidth = "w-screen",
  titleSize = "text-[1.2rem]",
  titleFont = "font-semibold",
  showVideoDescription = true,
  descriptionWidth = "w-[40vw]",
  divBorder = "",
  video
}) => {
  if (!video) return null;

  return (
    <div className={`${mainDivWidth} ${divBorder} mt-2`}>
      <div className="text-white ml-3 py-2 flex">
        <Link to={`/watchpage/${video._id}`}>
          <img
            className={`${imgWidth} ${imgHeight} rounded-md`}
            src={video.thumbnail}
            alt="Thumbnail"
          />
        </Link>

        <div className="ml-3 w-[37%]">
          <h1 className={`${titleFont} ${titleSize}`}>{video.title}</h1>
          <p className="mb-1">200k • views</p>

          <div className="flex items-center mb-2">
            <Link to={`/channel/${video.owner?.username}`}>
              <img
                className="w-8 h-8 mr-3 rounded-full"
                src={video.owner?.avatar}
                alt="Avatar"
              />
            </Link>
            <p>{video.owner?.username}</p>
          </div>

          {showVideoDescription && (
            <p className={`${descriptionWidth}`}>{video.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoListings;
