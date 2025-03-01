import React from "react";
import Lottie from "lottie-react";
import notFoundAnimation from "../assets/404.json";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col bg-gray-1000 items-center justify-center h-screen">
      <div className="w-80">
        <Lottie animationData={notFoundAnimation} loop={true} />
      </div>
      <p className="text-lg text-gray-600 mt-4">Oops! The video was not found.</p>
      <Link to="/" className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
