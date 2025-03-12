import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import LoaderSpinner from "../../components/Loader";
import NotFound from "../../components/NotFound";
import VideoListings from "./VideoListings";
import { baseVideoUrl } from "../../utils/baseUrl";

const SearchVideoListingPage = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  console.log(location.key)
  const query = new URLSearchParams(location.search).get("query");
  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${baseVideoUrl}?query=${query}`, { withCredentials: true });
      console.log('res', response)
      if (response.data.data?.length > 0) {
        setVideos(response.data.data);
      } else {
        setError("No videos found");
      }
    } catch (err) {
      setError(`An error occurred while fetching videos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      fetchVideos();
    }
  }, [location.key,query]);

  return (
    <div className="w-full h-full ml-3">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <LoaderSpinner />
        </div>
      ) : error ? (
        <NotFound />
      ) : (
        <div className="">
          {videos?.map((video) => (
            <div className=" rounded-lg w-full" key={video._id}>
              <VideoListings showVideoDescription={false} video={video} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchVideoListingPage;
