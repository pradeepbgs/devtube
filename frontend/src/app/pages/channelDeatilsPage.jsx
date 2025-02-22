import { Link, NavLink, Outlet, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import getUserprofile from "../../useHooks/getUserProfile";
import { toggleSubscribe } from "../../useHooks/subscribeToggle";
import {showUserIconFalse} from '../../utils/toggleSlice'



const ChannelDetailsPage = () => {
  const dispatch = useDispatch();
  const { username } = useParams();

  const { user } = useSelector((state) => state.user);
  const authUser = useSelector((state) => state.auth.user);

  const handleSubscribe = async () => {
    toggleSubscribe(user?._id, dispatch);
  }


  useEffect(() => {
    dispatch(showUserIconFalse())
    getUserprofile(dispatch, username);
  },[]);


  return (
    <div className="w-full h-full text-white">
      <div className="border border-l-0 border-r-0 border-t-0">
        <div className="">
          <nav className="flex justify-center  w-full h-full ">
            <ul className="fixed flex justify-between border border-dotted bg-gray-700 rounded-sm px-5 py-3 mt-2">
              <NavLink
                to={`/channel/${user?.username}`}
                className={({ isActive }) =>
                  `${isActive ? "text-purple-400" : "text-gray-200"}`
                }
              >
                <button className="px-6 py-1 mt mr-5 border rounded-sm hover:bg-purple-500 hover:text-white">
                  Videos
                </button>
              </NavLink>

              <NavLink
                to={`/channel/${user?.username}/playlist`}
                className={({ isActive }) =>
                  `${isActive ? "text-purple-400 " : "text-gray-200"}`
                }
              >
                <button className="px-6 py-1 mt mr-5 border rounded-sm hover:bg-purple-500">
                  Playlist
                </button>
              </NavLink>

              <NavLink
                to={`/channel/${user?.username}/tweets`}
                className={({ isActive }) =>
                  `${isActive ? "text-purple-400" : "text-gray-200"}`
                }
              >
                <button className="px-6 py-1 mt mr-5 border rounded-sm hover:bg-purple-500">
                  Tweets
                </button>
              </NavLink>

              <NavLink
                to={`/channel/${user?.username}/subscribed`}
                className={({ isActive }) =>
                  `${isActive ? "text-purple-400" : "text-gray-200"}`
                }
              >
                <button className="px-6 py-1 mt border rounded-sm hover:bg-purple-500">
                  Subscribed
                </button>
              </NavLink>
            </ul>
          </nav>
        </div>
        <div className="mt-[6%] flex justify-around px-5 py-5">
          <div className="flex justify-center">
            <img
              className="w-[9.8vw] h-[9.7vw] rounded-full"
              src={`${user?.avatar}`}
              alt="AVATAR"
            />
            <div className="ml-10">
              <p className="font-semibold">{user?.fullname}</p>
              <p className="text-gray-300">@{user?.username}</p>
              <p className="text-gray-300">{user?.subscribersCount}</p>
              {authUser?._id === user?._id ? (
                <>
                  <Link 
                  to={`/channel/${user?.username}/edit`}
                  className="bg-purple-500 rounded-md hover:bg-purple-600 px-6 py-2">
                    <button className="mt-4">Edit</button>
                  </Link>
                </>
              ) : (
                <>
                  <button 
                  onClick={handleSubscribe}
                  className="bg-purple-500 px-6 py-2 mt-4">
                    {user?.isSubscribed ? "unsubscribe" : "subscribe"}
                  </button>
                </>
              )}
            </div>
          </div>
          <img
            className="w-[30vw] rounded-md"
            src={`${user?.coverImage}`}
            alt="coverImage"
          />
        </div>
      </div>
       
      <div className="flex justify-center">
        <Outlet />
      </div>
    </div>
  );
};

export default ChannelDetailsPage;
