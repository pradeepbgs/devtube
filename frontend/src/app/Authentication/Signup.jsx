import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    email: '',
    password: '',
    avatar: null,
    coverImage: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('username', formData.username);
    data.append('fullname', formData.fullname);
    data.append('email', formData.email);
    data.append('password', formData.password);
    if (formData.avatar) {
      data.append('avatar', formData.avatar);
    }
    if (formData.coverImage) {
      data.append('coverImage', formData.coverImage);
    }
    try {
      await axios.post('/api/v1/users/register', data, {
        withCredentials: true,
      });
      navigate('/login');
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="bg-gray-900 opacity-80 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Register</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative mb-4">
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              className="absolute w-full h-48 rounded-t-lg object-cover opacity-0 cursor-pointer"
              onChange={handleChange}
              required
            />
            <div className="w-full h-48 bg-gray-200 rounded-md flex justify-center items-center overflow-hidden">
              {formData.coverImage ? (
                <img
                  src={URL.createObjectURL(formData.coverImage)}
                  alt="Cover Preview"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <span className="text-gray-500">Upload Cover Image</span>
              )}
            </div>
          </div>
          <div className="relative w-24 h-24 mx-auto mb-4">
            <input
              type="file"
              name="avatar"
              accept="image/*"
              className="absolute w-full h-full rounded-full object-cover opacity-0 cursor-pointer"
              onChange={handleChange}
              required
            />
            <div className="w-full h-full bg-gray-200 rounded-full flex justify-center items-center overflow-hidden">
              {formData.avatar ? (
                <img
                  src={URL.createObjectURL(formData.avatar)}
                  alt="Avatar Preview"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-500">Upload Avatar</span>
              )}
            </div>
          </div>
          <input
            type="text"
            name="username"
            className="bg-gray-100 px-4 py-2 rounded-md text-gray-800"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="fullname"
            className="bg-gray-100 px-4 py-2 rounded-md text-gray-800"
            placeholder="Enter your full name"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            className="bg-gray-100 px-4 py-2 rounded-md text-gray-800"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            className="bg-gray-100 px-4 py-2 rounded-md text-gray-800"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Register
          </button>
        </form>
        <p className="text-gray-300 text-center mt-4">
          Already a user?{' '}
          <a href="/login" className="text-indigo-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
