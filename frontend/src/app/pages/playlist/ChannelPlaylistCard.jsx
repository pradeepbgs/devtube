import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

const ChannelPlaylistCard = ({playlist}) => {

  const {user} = useSelector(state => state.user)

  return (

        <Link to={`/channel/${user?.username}/playlist/list?${playlist?.name}`}>
        <div  className=" ">
        <div className="relative px-5 py-4">
          <img 
          className="w-[30vw]" 
          src={`https://images.unsplash.com/photo-1682686581498-5e85c7228119?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`} 
          alt="playlist image" 
          />
          <div className="flex absolute bottom-4 px-[0.6rem] bg-gray-600 bg-opacity-50 backdrop-blur-sm py-5">
            <div>
              <span>Playlist</span>
              <p>
                {playlist?.viewCount} views . {playlist?.ago} hours ago
              </p>
            </div>
            <p className='text-white ml-[10vw]'>
              <FontAwesomeIcon icon={faVideo} /> {`${playlist?.videoCount} videos`}
            </p>
          </div>
        </div>
        <div className="px-5">
            <h1 className="text-[1.2rem] font-semibold">{playlist?.name}</h1>
            <p className="w-[90%] text-gray-300">{playlist?.description}</p>
          </div>
        </div>
        </Link>

  )
}

export default ChannelPlaylistCard