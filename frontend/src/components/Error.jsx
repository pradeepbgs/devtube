import Lottie from "lottie-react";
import React from "react";
import ErrorJson from "../assets/error.json";

function ErrorPage({ err }) {
  return (
    <div className="flex flex-col items-center h-screen">
      <Lottie animationData={ErrorJson} loop={true} className="w-[30%]" />
      <h1 className="text-2xl font-mono mt-4">{err || "Something went wrong"}</h1>
    </div>
  );
}

export default React.memo(ErrorPage);
