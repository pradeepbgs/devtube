import React from "react";
import { VideoListings } from "../../index";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ChannelPlaylistVideo = () => {
  const videos = [
    {
      title: "Video 1",
      thumbnail:
        "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      views: 1000,
      duration: "5:30",
    },
    {
      title: "Video 2",
      thumbnail:
        "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      views: 1500,
      duration: "8:45",
    },
    {
      title: "Video 3",
      thumbnail:
        "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      views: 1200,
      duration: "6:20",
    },
    {
      title: "Video 4",
      thumbnail:
        "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      views: 800,
      duration: "4:15",
    },
    {
      title: "Video 5",
      thumbnail:
        "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      views: 2000,
      duration: "10:00",
    },
    {
      title: "Video 6",
      thumbnail:
        "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      views: 3000,
      duration: "12:30",
    },
    {
      title: "Video 7",
      thumbnail:
        "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      views: 1800,
      duration: "9:45",
    },
    {
      title: "Video 8",
      thumbnail:
        "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      views: 2500,
      duration: "11:20",
    },
    {
      title: "Video 9",
      thumbnail:
        "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      views: 900,
      duration: "4:50",
    },
    {
      title: "Video 10",
      thumbnail:
        "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      views: 1600,
      duration: "8:00",
    },
    {
      title: "Video 1",
      thumbnail:
        "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      views: 1000,
      duration: "5:30",
    },
    {
      title: "Video 2",
      thumbnail:
        "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      views: 1500,
      duration: "8:45",
    },
    {
      title: "Video 3",
      thumbnail:
        "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      views: 1200,
      duration: "6:20",
    },
    {
      title: "Video 4",
      thumbnail:
        "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      views: 800,
      duration: "4:15",
    },
    {
      title: "Video 5",
      thumbnail:
        "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      views: 2000,
      duration: "10:00",
    },
    {
      title: "Video 6",
      thumbnail:
        "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      views: 3000,
      duration: "12:30",
    },
    {
      title: "Video 7",
      thumbnail:
        "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      views: 1800,
      duration: "9:45",
    },
    {
      title: "Video 8",
      thumbnail:
        "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      views: 2500,
      duration: "11:20",
    },
    {
      title: "Video 9",
      thumbnail:
        "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      views: 900,
      duration: "4:50",
    },
    {
      title: "Video 10",
      thumbnail:
        "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      views: 1600,
      duration: "8:00",
    },
    // Repeat the pattern for more videos...
  ];

  return (
    <div className="flex justify-evenly">
      
      <div className="">
        <div className="relative px-5 py-4">
          <img
            className="w-[25.6vw] rounded"
            src="https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
          />
          <div className="flex absolute bottom-4 w-[90%] bg-gray-600 bg-opacity-50 backdrop-blur-sm py-5">
            <div className="w-fit px-1">
              <span>Playlist</span>
              <p className="w-[16vw] text-gray-200">
                100K views • 12 hours ago
              </p>
            </div>
            <p className="text-white ml-2">
              <FontAwesomeIcon icon={faVideo} /> 100 {`videos`}
            </p>
          </div>
        </div>
        <div className="ml-5 w-[25vw]">
          <h1 className=" font-semibold">React Mastery</h1>
          <p className="w-[25vw] text-gray-300">
            Master the art of building dynamic user interfaces with React.
          </p>
          <div className="flex mt-5">
            <img className="w-10 h-10 rounded-full mr-5"
            src="https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
            <div>
              <h1 className="font-bold">Username</h1>
              <p className="text-gray-300">200K subscribers</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="">
        {videos.map((video, index) => (
          <VideoListings
          divBorder="border"
            titleWidth="w-[25vw]"
            titleSize="text-[1.2vw]"
            descriptionWidth="w-[29vw]"
            mainDIvWidth="w-[50vw]"
            imgWidth="w-[16vw]"
            imgHeight="h-[20vh]"
            showVideoDescription= {false}
            key={index}
            video={video}
          />
        ))}
      </div>
      
    </div>
  );
};

export default ChannelPlaylistVideo;
