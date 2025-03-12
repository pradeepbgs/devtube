import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OtpPage from '../../components/OtpPage';

const Signup = () => {
  const [otpPage, setOtpPage] = useState(true)
  const [error, setError] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
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
    // if (formData.avatar) {
    //   data.append('avatar', formData.avatar);
    // }
    // if (formData.coverImage) {
    //   data.append('coverImage', formData.coverImage);
    // }
    try {
      const res = await axios.post('/api/v1/users/register', data, {
        withCredentials: true,
      });

      if (res.status === 201) {
        setSignupEmail(formData.email)
        setOtpPage(true)
      }
      // navigate('/login');
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      {
        otpPage ? (
          <OtpPage email={signupEmail} />
        ) 
        : (
          <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-3xl">
            <h1 className="text-3xl font-bold text-white text-center mb-6">Register</h1>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              {/* Avatar Upload */}
              {/* <div className="flex flex-col items-center">
            <label className="text-gray-300 mb-2">Avatar</label>
            <div className="relative w-24 h-24">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                className="absolute w-full h-full opacity-0 cursor-pointer"
                onChange={handleChange}
                required
              />
              <div className="w-24 h-24 bg-gray-700 rounded-full flex justify-center items-center overflow-hidden">
                {formData.avatar ? (
                  <img
                    src={URL.createObjectURL(formData.avatar)}
                    alt="Avatar Preview"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">Upload</span>
                )}
              </div>
            </div>
          </div> */}

              {/* Cover Image Upload */}
              {/* <div className="flex flex-col items-center">
            <label className="text-gray-300 mb-2">Cover Image</label>
            <div className="relative w-full h-24">
              <input
                type="file"
                name="coverImage"
                accept="image/*"
                className="absolute w-full h-full opacity-0 cursor-pointer"
                onChange={handleChange}
                required
              />
              <div className="w-full h-24 bg-gray-700 rounded-md flex justify-center items-center overflow-hidden">
                {formData.coverImage ? (
                  <img
                    src={URL.createObjectURL(formData.coverImage)}
                    alt="Cover Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <span className="text-gray-400">Upload</span>
                )}
              </div>
            </div>
          </div> */}

              {/* Left Column (Username & Email) */}
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  name="username"
                  className="bg-gray-100 px-4 py-2 rounded-md text-gray-800"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  className="bg-gray-100 px-4 py-2 rounded-md text-gray-800"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Right Column (Full Name & Password) */}
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  name="fullname"
                  className="bg-gray-100 px-4 py-2 rounded-md text-gray-800"
                  placeholder="Full Name"
                  value={formData.fullname}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  className="bg-gray-100 px-4 py-2 rounded-md text-gray-800"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="col-span-2">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-all"
                >
                  Register
                </button>
              </div>
            </form>

            <p className="text-gray-300 text-center mt-4">
              Already a user?{' '}
              <Link to="/login" className="text-indigo-400 hover:underline">
                Login
              </Link>
            </p>
          </div>
        )}
    </div>
  );
};

export default Signup;
