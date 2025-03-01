import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { showDescription } from "../utils/toggleSlice";

const Description = ({ views, createdAt, description }) => {
  const dispatch = useDispatch();
  const isDescription = useSelector((state) => state.toggle.description);

  return (
    <div className="">
      <p className="text-sm text-gray-400">{views} Views · {createdAt} ago</p>
      <button
        onClick={() => dispatch(showDescription())}
        className="text-blue-400 mt-1 underline"
      >
        {!isDescription && "Show Description"}
      </button>
      {isDescription && (
        <p className="mt-2 px-1 text-gray-300">{description || "No description available"}</p>
      )}
      <button
        onClick={() => dispatch(showDescription())}
        className="text-blue-400 mt-2 underline"
      >
        {isDescription && "Hide Description"}
      </button>
    </div>
  );
};

export default Description;
