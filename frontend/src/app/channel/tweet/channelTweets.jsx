import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaTwitter } from 'react-icons/fa';
import TweetCard from './TweetCard';
import { getUserTweets } from '../../../useHooks/getUserTweets';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../components/Loader';

const ChannelTweets = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tweet, setTweet] = useState('');
  const dispatch = useDispatch();
  const { user, userTweets } = useSelector((state) => state.user);

  const handleAddTweet = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/v1/tweets`, { content: tweet }, { withCredentials: true });
      if (res?.data?.data) {
        setTweet('');
        setIsLoading(true);
      }
    } catch (error) {
      console.error('Error adding tweet:', error);
    }
  };

  useEffect(() => {
    if (user && !userTweets) {
      getUserTweets(dispatch, user?._id);
    }
  }, [user, userTweets,isLoading]);

  if(isLoading)
    return <Loader />;

  return (
    <div>
      <form onSubmit={handleAddTweet} action="" className='mb-3 border border-t-0 border-l-0 border-r-0 py-3'>
        <textarea
          className='bg-transparent border'
          placeholder='Write something'
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
          name="content" id="" cols="60" rows="2"
        >
        </textarea>
        <button type='submit'>Tweet</button>
      </form>
      {
        userTweets?.userTweets?.length > 0 ? (
          userTweets.userTweets.map((tweet) => (
            <div key={tweet?._id} className='border border-l-0 border-r-0 border-t-0 pb-4'>
              <TweetCard tweet={tweet} user={user} />
            </div>
          ))
        ) : (
          <div className='flex flex-col items-center w-full mt-5'>
            <FaTwitter size={50} />
            <h1 className='font-bold'>No Tweets</h1>
            <p className='font-semibold'>This channel has yet to make a Tweet.</p>
          </div>
        )
      }
    </div>
  );
};

export default ChannelTweets;
