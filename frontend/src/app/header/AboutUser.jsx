import React from 'react'
import { FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../utils/authSlice';
import axios from 'axios';
import { baseAuthUrl } from '../../utils/baseUrl';

const AboutUser = ({user}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // const USER  = useSelector((state) => state.auth.user);

    const logoutUser = async () => {
        try {
          await axios.post(`${baseAuthUrl}/logout`, null, {
            withCredentials: true,
          });
          dispatch(logout());
          navigate("/");
          localStorage.removeItem("user");
        } catch (error) {
          console.error("Error logging out:", error);
        }
      };
    
  return (
    <div className='bg-zinc-800 h-[30vw] w-[19vw] rounded-md'>
        <div className='flex px-3 border border-t-0 border-l-0 border-r-0 pb-3'>
            <img 
            className='w-[3.2vw] h-[3.2vw] rounded-full mt-3'
            src={`${user?.avatar}`} 
            alt="" />
            <div className='ml-3 mt-2'>
                <Link to={`/channel/${user?.username}`} ><p className='text-gray-200 font-semibold'>{user?.fullname}</p></Link>
                <Link to={`/channel/${user?.username}`} ><p className='text-gray-200 font-semibold'>@{user?.username}</p></Link>
                <Link to={`/channel/${user?.username}`} ><p className='mt-2 text-blue-600'>View your channel </p></Link>
            </div>
        </div>
        <div className=''>
            <button 
            onClick={logoutUser}
            className='px-2 mt-4 flex items-center w-full h-10 hover:bg-zinc-600'>
                <FaSignOutAlt/>
                <p className='ml-3'>Log out</p>
            </button>
        </div>
    </div>
  )
}

export default AboutUser