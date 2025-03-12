import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { baseAuthUrl } from '../utils/baseUrl';

const OtpVerification = (email) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseAuthUrl}/verify-otp`, { email,otp }, { withCredentials: true });
      if (response.status === 200) {
        navigate('/login');
      }
    } catch (error) {
      setError(error?.message || 'Invalid OTP');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Enter OTP</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
          <input
            className="bg-gray-700 px-4 py-3 rounded-md text-white text-center text-lg tracking-widest"
            type="text"
            maxLength="6"
            required
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 transition-all px-4 py-3 rounded-md text-white font-semibold">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default React.memo(OtpVerification);
