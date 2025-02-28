import React from 'react'
import { FaThumbsUp } from "react-icons/fa";

const TweetCard = ({tweet, user}) => {

  return (
    <div>
        <div className='flex mt-5'>
            <img 
            className='w-[3.5vw] h-[3.5vw] rounded-full'
            src={tweet?.profilePicture} 
            alt="" 
            />
            <div className='ml-2'>
                <span className='mr-6 font-semibold'>@{tweet?.username}</span>
                <span className='text-purple-200'>{tweet?.ago}</span>
                <p className='mt-2 w-[60vw] ml-4'>{tweet?.content}</p>
                <div className='mt-2'>  
                    <button className='flex items-center ml-4'>
                    <FaThumbsUp className='mr-4'/>
                    {tweet?.likesCount}
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default TweetCard