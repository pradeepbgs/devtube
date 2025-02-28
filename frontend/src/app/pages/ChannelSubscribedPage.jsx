import React , {useState} from 'react'
import  {IoIosPeople} from 'react-icons/io'

const ChannelSubscribedPage = () => {
  const [isTr, setIstr] = useState(false)



  return isTr ? (
    <div className='text-white'>ChannelSubscribedPage</div>
  ) : <div className='flex flex-col items-center mt-5'>
      <IoIosPeople
      size={70}
       />
       <h1 className='font-bold'>No people subscribers</h1>
       <p className='font-semibold'>This channel has yet to subscribe a new channel.</p>
  </div>
}

export default ChannelSubscribedPage