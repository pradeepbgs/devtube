import mongoose from "mongoose";
import commentModel from "../models/comment.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!mongoose.isValidObjectId(videoId)) {
    return res.status(400).json(new apiError(400, "Invalid video id"));
  }

  const result = await commentModel.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              avatar: 1,
              fullname: 1,
            },
          },
          {
            $addFields: {
              owner: { $arrayElemAt: ["$owner", 0] },
            },
          },
        ],
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
    {
      $project: {
        createdAt: 1,
        _id: 1,
        content: 1,
        "owner._id": 1,
        "owner.username": 1,
        "owner.avatar": 1,
        "owner.fullname": 1,
      },
    },
  ]);

  if (result.length === 0) {
    return res.status(200).json(new apiResponse(200, "No comments found"));
  }

  return res
    .status(200)
    .json(new apiResponse(200, result, "successfully fetched comments"));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(videoId) || !userId) {
    return res.status(400).json(new apiError(400, "Invalid video id or user id"));
  }

  const { content } = req.body;

  if (!content) {
    return res.status(400).json(new apiError(400, "Comment text is required"));
  }

  const comment = await commentModel.create({
    content,
    video: videoId,
    owner: userId,
  });

  if (!comment) {
    return res.status(400).json(new apiError(400, "Comment could not be created"));
  }

  return res
    .status(201)
    .json(new apiResponse(200, comment, "Comment successful"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const userId = req.user._id;

  try {
    if (!mongoose.isValidObjectId(commentId)) {
      return res.status(400).json(new apiError(400, "Invalid comment ID"));
    }

    const { content } = req.body;

    const updatedComment = await commentModel.findOneAndUpdate(
      {
        _id: commentId,
        owner: userId,
      },
      { content: content },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json(new apiError(404, "Comment not found or you don't have permission to update it"));
    }

    return res
      .status(200)
      .json(new apiResponse(200, "Comment updated successfully", updatedComment));
  } catch (error) {
    return res.status(error.statusCode || 500).json(new apiError(error.statusCode || 500, error.message || "Internal Server Error"));
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(commentId) || !userId) {
    return res.status(400).json(new apiError(400, "Invalid comment ID or USER ID"));
  }

  await commentModel.findByIdAndDelete({
    _id: commentId,
    owner: userId,
  });

  return res
    .status(200)
    .json(new apiResponse(200, "Comment deleted successfully"));
});

export {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment
};
