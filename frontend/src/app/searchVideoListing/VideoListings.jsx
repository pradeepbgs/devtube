import React from "react";
import { Link } from "react-router-dom";

const VideoListings = ({
  imgWidth = "w-[18vw]",
  imgHeight = "h-[11vw]",
  mainDivWidth = "w-full",
  titleSize = "text-[1.2rem]",
  titleFont = "font-semibold",
  showVideoDescription = true,
  descriptionWidth = "w-full",
  divBorder = "",
  video
}) => {
  if (!video) return null;

  return (
    <div className={`${mainDivWidth} ${divBorder} mt-2`}>
      <div className="flex text-white py-2">
        <Link to={`/watchpage/${video._id}`} className="flex-shrink-0">
          <img
            className={`${imgWidth} ${imgHeight} rounded-md`}
            src={video.thumbnail}
            alt="Thumbnail"
          />
        </Link>

        <div className="ml-3 flex-grow">
          <h1 className={`${titleFont} ${titleSize} truncate`}>{video.title}</h1>
          <p className="mb-1">200k • views</p>

          <div className="flex items-center mb-2">
            <Link to={`/channel/${video.owner?.username}`} className="flex-shrink-0">
              <img
                className="w-8 h-8 mr-3 rounded-full"
                src={video.owner?.avatar}
                alt="Avatar"
              />
            </Link>
            <p className="truncate">{video.owner?.username}</p>
          </div>

          {showVideoDescription && (
            <p className={`${descriptionWidth} line-clamp-2`}>{video.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(VideoListings);
