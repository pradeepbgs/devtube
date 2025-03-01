import { Link, NavLink, Outlet, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import getUserprofile from "../../useHooks/getUserProfile";
import { toggleSubscribe } from "../../useHooks/subscribeToggle";
import { showUserIconFalse } from "../../utils/toggleSlice";
import { RiEdit2Fill } from "react-icons/ri";
import Loader from "../../components/Loader";

const ChannelDetailsPage = () => {
    const [isLoading, setIsLoading]  = useState(true)
  const dispatch = useDispatch();
  const { username } = useParams();

  const { user } = useSelector((state) => state.user);
  const authUser = useSelector((state) => state.auth.user);

  const handleSubscribe = async () => {
    toggleSubscribe(user?._id, dispatch);
  };

  useEffect(() => {
    dispatch(showUserIconFalse());
    getUserprofile(dispatch, username);
    setIsLoading(false)
    return () => {
      dispatch(showUserIconFalse());
    };
  }, [username, dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header/Cover Image Section */}
      <div className="relative">
        <img
          src={user?.coverImage}
          alt="Cover"
          className="w-full h-96 object-cover"
        />
        {/* user details */}
        <div className="flex items-end justify-between">
          <img
            src={user?.avatar}
            alt="Avatar"
            className="w-32 h-32 absolute bottom-[-1%] left-3 bg-zinc-900 rounded-full border-4 border-gray-800"
          />
          <div className="ml-[14%] mt-1">
            <h2 className="text-xl font-semibold font-mono">{user?.fullname}</h2>
            <p className="text-gray-400 font-mono">@{user?.username}</p>
            <p className="text-gray-400 font-mono">
              {user?.subscribersCount} Subscribers
            </p>
          </div>
          {/* Subscribe Button */}
          {/* Edit Profile Button */}
          <div className="mr-[20%]">
            {authUser?._id === user?._id ? (
              <Link
                to={`/channel/${user?.username}/edit`}
              >
                <RiEdit2Fill size={32}/>

              </Link>
            ) : (
              <button
                onClick={handleSubscribe}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md"
              >
                {user?.isSubscribed ? "Unsubscribe" : "Subscribe"}
              </button>
            )}
          </div>
        </div>


      </div>

      {/* Navigation Tabs */}
      <nav className="border-b border-gray-800 mt-4">
        <ul className="flex justify-start space-x-4 p-4">
          <li>
            <NavLink
              to={`/channel/${user?.username}`}
              className={({ isActive }) =>
                `px-3 py-2 rounded-full ${isActive
                  ? "bg-purple-600 text-white"
                  : "hover:bg-gray-800 text-gray-300"
                }`
              }
            >
              Videos
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/channel/${user?.username}/playlist`}
              className={({ isActive }) =>
                `px-3 py-2 rounded-full ${isActive
                  ? "bg-purple-600 text-white"
                  : "hover:bg-gray-800 text-gray-300"
                }`
              }
            >
              Playlists
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/channel/${user?.username}/tweets`}
              className={({ isActive }) =>
                `px-3 py-2 rounded-full ${isActive
                  ? "bg-purple-600 text-white"
                  : "hover:bg-gray-800 text-gray-300"
                }`
              }
            >
              Tweets
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/channel/${user?.username}/subscribed`}
              className={({ isActive }) =>
                `px-3 py-2 rounded-full ${isActive
                  ? "bg-purple-600 text-white"
                  : "hover:bg-gray-800 text-gray-300"
                }`
              }
            >
              Subscribed
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Content Area */}
      
      <div className="p-4">
        <Outlet />
      </div>
      
    </div>
  );
};

export default ChannelDetailsPage;