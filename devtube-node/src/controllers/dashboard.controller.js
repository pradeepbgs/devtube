import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponce.js";
import mongoose from "mongoose";
import {User} from "../models/user.model.js";


const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const { channelId } = req.params; // because channel is also a user so we can perform task by channelId
    validateChannelId(channelId);

    try {
        const channelStats = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(channelId)
                }
            },
            {
                $lookup: {
                    from: "video",
                    localField: "_id",
                    foreignField: "owner",
                    as: "videos"
                }
            },
            {
                $lookup: {
                    from: "subscription",
                    localField: "_id",
                    foreignField: "channel",
                    as: "subscribers"
                }
            },
            {
                $lookup: {
                    from: "like",
                    localField: "_id",
                    foreignField: "likedBy",
                    as: "likes"
                }
            },
            {
                $addFields: {
                    videosCount: {
                        $size: "$videos"
                    },
                    subscribersCount: {
                        $size: "$subscribers"
                    },
                    likesCount: {
                        $size: "$likes"
                    }
                }
            }
        ]);

        if (channelStats.length === 0) {
            return res.status(404).json(new apiResponse(404, null, "No channel found"));
        }

        return res.status(200).json(new apiResponse(200, channelStats[0], 'channel stats fetched successfully'));
    } catch (error) {
        return res.status(500).json(new apiResponse(500, null, "Error fetching channel stats"));
    }
});

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const { channelId } = req.params; // because channel is also a user so we can perform task by channelId
    validateChannelId(channelId);

    try {
        const videos = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(channelId)
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "_id",
                    foreignField: "owner",
                    as: "videos"
                }
            }
        ]);

        if (videos.length === 0 || !videos[0].videos) {
            return res.status(404).json(new apiResponse(404, null, "No videos found"));
        }

        return res.status(200).json(new apiResponse(200, videos[0].videos, "Videos fetched successfully"));
    } catch (error) {
        return res.status(500).json(new apiResponse(500, null, "Error fetching channel videos"));
    }
});

export {
    getChannelStats,
    getChannelVideos
};
