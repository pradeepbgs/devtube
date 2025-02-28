// import React, { useState } from 'react';
import { Link, NavLink, Outlet, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
// import { addUser } from "../../utils/userSlice";
// import { addVideo } from "../../utils/userSlice";
// import UploadPage from "./uploadPage/UploadPage";
import getUserprofile from "../../../useHooks/getUserProfile";

const Editinfo = () => {
  const dispatch = useDispatch();
  const { username } = useParams();

  const { user } = useSelector((state) => state.user);
  const authUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    getUserprofile(dispatch, username);
  }, []);

  return (
    <div className="w-full h-full text-white">
      <div>
        <nav className="mt-3">
          <ul className="flex justify-evenly">
            <NavLink
            to={`/channel/${user?.username}/edit`}
              className={({ isActive }) =>
                `${isActive ? "text-purple-500" : "text-gray-200"
                }  px-5 py-1 rounded-md border`
              }
            >
              Personal details
            </NavLink>
            <NavLink
            to={`/channel/${user?.username}/edit/channel-details`}
              className={({ isActive }) =>
                `${isActive ? "text-purple-500" : "text-gray-200"
                }  px-5 py-1 rounded-md border`
              }
            >
              Channel details
            </NavLink>
            <NavLink
            to={`/channel/${user?.username}/edit/change-password`}
              className={({ isActive }) =>
                `${isActive ? "text-purple-500" : "text-gray-200"
                }  px-5 py-1 rounded-md border`
              }
            >
              Change Password
            </NavLink>
          </ul>
        </nav>
      </div>
      <div className="flex justify-center">
        <Outlet />
      </div>
    </div>
  );
};

export default Editinfo;