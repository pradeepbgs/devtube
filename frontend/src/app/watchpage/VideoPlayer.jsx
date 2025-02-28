import React from 'react';

 

const VideoPlayer = ({url}) => {
    // console.log(videoFile)
  return (
    <video 
    className="rounded-xl h-[34vw] w-[100%]"
    
    controls
    >
      <source src={`${url}`} type="video/mp4" />
    </video>
  );
};

export default VideoPlayer;
