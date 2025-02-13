import mongoose, { isValidObjectId } from "mongoose";
import Tweet from "../models/tweet.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content || typeof content !== "string") {
    return res.status(400).json(new apiError(400, "Tweet content is required"));
  }

  if (!req.user) {
    return res.status(400).json(new apiError(400, "User is required"));
  }

  const tweet = await Tweet.create({
    content,
    owner: req.user?._id,
  });

  if (!tweet) {
    return res.status(400).json(new apiError("Tweet not created"));
  }

  return res.status(201).json(new apiResponse(true, tweet, "Tweet created"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const {page=1, limit=30,} = req.query
  const { userId } = req.params;
  if (!userId || !isValidObjectId(userId)) {
     return res.status(400).json(new apiError(400, "Invalid user id") && "invalid user ID or Cant find ID");
  }

  const skip = (page - 1) * limit;


  const userTweets = await Tweet.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },{
      $sort: {
        createdAt: -1,
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
        as: "likes",
      }
    },
    {
      $project: {
        content: 1,
        createdAt: 1,
        owner: 1,
        likesCount: { $size: "$likes" },
        username: { $arrayElemAt: ["$user.username", 0] },
        profilePicture: { $arrayElemAt: ["$user.avatar", 0] },
      }, 
    },
    {
      $skip: skip,
    },
    {
      $limit: parseInt(limit),
    }
  ]);

  if (userTweets.length === 0) {
    return res.status(404).json(new apiError("User tweets not found", 404));
  }

  const allTweetsCount = await Tweet.countDocuments({ owner: userId });


  return res.status(200).json(
    new apiResponse(
       200,
      { userTweets, allTweetsCount, page, totalPages: Math.ceil(allTweetsCount / limit) },
       "User tweets",
    )
  );

});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { content } = req.body;
  if (!content) {
    return res.status(400).json(new apiError("pls write something"));
  }
  if (!req.user) {
    return res.status(400).json(new apiError("user can't find, pls login"));
  }
  const tweet = await Tweet.findOneAndUpdate(
    { owner: req.user?._id },
    { content },
    { new: true }
  );

  if (!tweet) {
    return res.status(400).json(new apiError("tweet not found"));
  }

  return res.status(200).json(new apiResponse(true, tweet, "tweet updated"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;
  if (!tweetId) {
    return res.status(400).json(new apiError("cant find tweet id"));
  }
  if (!isValidObjectId(tweetId)) {
    return res.status(400).json(new apiError("invalid tweet id"));
  }

  const authenticatedId = req.user;
  if (!authenticatedId) {
    return res.status(400).json(new apiError("user can't find, pls login"));
  }

  const tweet = await Tweet.findOneAndDelete({
    _id: tweetId,
    owner: authenticatedId?._id,
  });

  if (!tweet) {
    return res.status(400).json(new apiError("tweet not found"));
  }

  return res
  .status(200)
  .json(new apiResponse(200, "tweet deleted"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
