import React, { useEffect } from "react";
import { FaBars, FaSearch } from "react-icons/fa"; // Import the hamburger icon
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toggleMenu, showUserIcon } from "../../utils/toggleSlice";
import AboutUser from "./AboutUser";
import devtubeLogo from '../../assets/devt.avif'

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { userIcon } = useSelector((state) => state.toggle);

  const toggleMenuHandler = () => {
    dispatch(toggleMenu());
  };

  const formHandler = (e) => {
    e.preventDefault();
    const query = e.target.elements.search.value.trim();
    if (query !== "") {
      navigate(`/results?query=${query}`);
    }
  };
  

  // useEffect(() => {}, [isLoggedIn]);

  return (
    <div className="w-full">
      <div>
        <nav className=" px-10 py-3 text-white text-center border border-gray-500 border-x-0 border-t-0">
          <ul className="flex justify-between items-center">
            <div className="flex items-center">
              <FaBars
                onClick={toggleMenuHandler}
                className="mr-7 cursor-pointer hover:text-gray-300 text-[1.3rem]"
              />
              <button className=" text-[1.3rem]">
                <NavLink
                  className={({ isActive }) =>
                    `${isActive ? "text-purple-300" : "text-gray-200"} hover:to-blue-800`
                  }
                  to="/"
                >
                  <img 
                  src={devtubeLogo}
                  className="w-[20%] h-[20%] rounded-full"
                  />
                </NavLink>
              </button>
            </div>
            <div>
              <form onSubmit={formHandler} className="flex items-center border border-gray-600 rounded-md">
                <label
                  className=" px-2 py-1 border-r-0 rounded-md"
                  htmlFor=""
                >
                  <FaSearch />
                </label>
                <input
                  type="text"
                  placeholder="Search"
                  name="search" 
                  className="bg-[#1e1e1e] text-white w-[26vw]  px-3 py-1 focus:outline-none"
                />

                <button
                  type="submit"
                  className=" text-white px-2 py-1 ml-2 bg-purple-700 
                  hover:bg-purple-800
                  border-gray-400 border-r-0 border-b-0 border-t-0 focus:outline-none"
                >
                  Search
                </button>
              </form>
            </div>
            <div className="flex items-center">
              {!isLoggedIn ? (
                <div>
                    <Link to="/login">
                  <button className="mr-3 hover:bg-gray-700 px-3 py-1 border border-gray-700 rounded-md focus:outline-none">
                    Login
                  </button>
                    </Link>

                    <Link to="/signup">
                  <button className="bg-purple-500 hover:bg-purple-700 px-3 py-1 rounded-md focus:outline-none">
                    Signup
                  </button>
                    </Link>
                </div>
              ) : (
                <div
                  onClick={() => {
                    dispatch(showUserIcon());
                  }}
                >
                  <img
                    className="w-[3vw] h-[3vw] rounded-full cursor-pointer"
                    src={`${user?.avatar}`}
                    alt=""
                  />
                </div>
              )}
            </div>
          </ul>
        </nav>
      </div>
      {userIcon && isLoggedIn && (
        <div className="absolute top-3 right-24 transition-transform 1s">
          <AboutUser user={user} />
        </div>
      )}
    </div>
  );
};

export default Header;
