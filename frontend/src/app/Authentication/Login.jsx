import { useDispatch } from 'react-redux';
import axios from "axios";
import { useState } from "react";
import React from "react";
import {login} from '../../utils/authSlice'
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [error, setError] = useState('')
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const loginSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        "/api/v1/users/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      
      const { user } = response.data.data;
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
      dispatch(login(user));
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };
  



  return (
    <div className="text-white  w-screen h-full flex justify-center items-center ">
      <div
        className="bg-white w-[40vw] h-[70vh] flex justify-center 
      items-center 
      rounded-md bg-opacity-10"
      >
        <div className="text-center">
        {error && <h1 className='text-red-400 text-xl'>{error}</h1>}
          <h1 className="text-2xl mb-2 font-semibold">Login</h1>
          <form
            action=""
            onSubmit={loginSubmit}
            method="POST"
            id="loginForm"
            name="loginForm"
            className="flex flex-col w-fit mb-3 mt-5"
          >
            <input
              className="bg-gray-700 w-[30vw] px-5 mb-4 py-3 rounded-md"
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="bg-gray-700 px-5 py-3 mb-4 rounded-md"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 px-5 py-3 rounded-md">
              Login
            </button>
          </form>
          <span className="hover:text-blue-400 hover:underline">
            <a href="/signup">new ? Register</a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
