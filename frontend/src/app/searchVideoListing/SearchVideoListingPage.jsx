import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VideoListings from './VideoListings';

const SearchVideoListingPage = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { query } = useParams();

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`/api/v1/videos?query=${query}`, { withCredentials: true });
      if (response.data.data && response.data.data.length > 0) {
        setVideos(response.data.data);
      } else {
        setError('No videos found');
      }
    } catch (err) {
      setError(`An error occurred while fetching videos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [query]);

  return (
    <div className="w-full h-full p-4">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-blue-500 text-lg font-semibold">Loading...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500 text-lg font-semibold">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div className="shadow-md rounded-lg overflow-hidden" key={video._id}>
              <VideoListings showVideoDescription={false} video={video} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchVideoListingPage;
