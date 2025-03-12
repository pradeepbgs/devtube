import { useDispatch } from 'react-redux';
import axios from "axios";
import { useState } from "react";
import React from "react";
import { login } from '../../utils/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { baseAuthUrl } from '../../utils/baseUrl';

const Login = () => {
  const [error, setError] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseAuthUrl}/login`,
        { email, password },
        { withCredentials: true }
      );
      
      const { user } = response.data.data;
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
      dispatch(login(user));
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const handleForgotPassword = async (e) => {
    setIsLoading(true)
    e.preventDefault();
    try {
      await axios.post(`${baseAuthUrl}/request-password-reset `, { email });
      setMessage("Password reset link sent to your email.");
      setError("");
    } catch (error) {
      setError(error?.response?.data?.message);
    } finally{
      setIsLoading(false)
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-lg">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          {forgotPassword ? "Forgot Password" : "Login"}
        </h1>
        {error && <p className='text-red-500 text-center mb-4'>{error}</p>}
        {message && <p className='text-green-500 text-center mb-4'>{message}</p>}
        
        {forgotPassword ? (
          <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
            <input
              className="bg-gray-700 px-4 py-3 rounded-md text-white"
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="bg-indigo-600 hover:bg-indigo-700 transition-all px-4 py-3 rounded-md text-white font-semibold">
              Send Reset Link
            </button>
            <button 
              type="submit" 
              onClick={() => setForgotPassword(false)}
              className="text-indigo-400 hover:underline text-center"
            >
              Back to Login
            </button>
          </form>
        ) : (
          <form onSubmit={loginSubmit} className="flex flex-col gap-4">
            <input
              className="bg-gray-700 px-4 py-3 rounded-md text-white"
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="bg-gray-700 px-4 py-3 rounded-md text-white"
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type='submit' className="bg-indigo-600 hover:bg-indigo-700 transition-all px-4 py-3 rounded-md text-white font-semibold">
              Login
            </button>
          </form>
        )}
        
        {!forgotPassword && (
          <div className="text-gray-300 text-center mt-4">
            <button onClick={() => setForgotPassword(true)} className="text-indigo-400 hover:underline">
              Forgot Password?
            </button>
          </div>
        )}
        
        <p className="text-gray-300 text-center mt-4">
          Not a member yet?{' '}
          <Link to="/signup" className="text-indigo-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
