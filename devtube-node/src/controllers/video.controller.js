import { Worker } from "worker_threads";
// import {redis} from '../utils/redisClient.js'
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deletOnCloudanry,
  getPublicId,
} from "../utils/cloudinary.js";
import videoModel from "../models/video.model.js";
import { apiResponse } from "../utils/apiResponce.js";
import { cleanUploadedfiles } from "../utils/cleanup.videoFiles.js";
import * as mongoose from "mongoose";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 9, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination

  try {
    const validSortFields = ["createdAt", "title"];
    const validSortTypes = ["asc", "desc"];
    if (sortBy && !validSortFields.includes(sortBy)) {
      return res.status(400).json({ message: "Invalid sort field" });
    }
    if (sortType && !validSortTypes.includes(sortType)) {
      return res.status(400).json({ message: "Invalid sort type" });
    }
 
    const queryObj = query
      ? {
          title: {
            $regex: new RegExp(
              query
                .replace(/[-\/\\^$*+?.()|[\]{}]/g, " ")
                .split(" ")
                .join("|"),
              "i"
            ),
          },
        }
      : {};

    const videos = await videoModel
      .find(queryObj)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("owner", "fullname username  avatar coverImage");

    return res.status(200).json(new apiResponse(200, videos, "sucess"));
  } catch (error) {
    return res.status(400).json(new apiError(error.message, error.statusCode));
  }
});

const getUserVideos = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    // const cacheValue = await redis.get('videos');

    // if(cacheValue){
    //   return res.status(200).json(new apiResponse(200, JSON.parse(cacheValue), "success"));
    // }

    const videos = await videoModel.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $addFields: {
          owner: { $arrayElemAt: ["$owner", 0] },
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          videoFile: 1,
          thumbnail: 1,
          duration: 1,
          views: 1,
          createdAt: 1,
          owner: {
            _id: 1,
            username: 1,
            fullname: 1,
            avatar: 1,
            coverImage: 1,
          },
        },
      },
    ]);

    if (videos.length === 0) {
      return res.status(200).json(new apiResponse(200, videos, "success"));
    }

    // await redis.set('videos', JSON.stringify(videos), 'EX', 60);

    return res.status(200).json(new apiResponse(200, videos, "success"));
  } catch (error) {
    return res
      .status(500)
      .json(new apiResponse(500, null, "Internal Server Error"));
  }
});

const videoUpload = asyncHandler(async (req, res) => {
  const user = req.user;
  const { title, description } = req.body;

  try {
    let videoFile;
    if (
      req.files &&
      Array.isArray(req.files.video) &&
      req.files.video.length > 0
    ) {
      videoFile = req.files.video[0].path;
    }

    let thumbnail;
    if (
      req.files &&
      Array.isArray(req.files.thumbnail) &&
      req.files.thumbnail.length > 0
    ) {
      thumbnail = req.files.thumbnail[0].path;
    }

    if (!user) return res.status(401).json(new apiError(401, "user not found"));
    if ([title, description].some((field) => field?.trim() === "")) {
      return res.status(400).json(new apiError(400, "All fields are required"));
    }

    if (!videoFile || !thumbnail) {
      return res.status(400).json({ message: "Both video file and thumbnail are required" });
    }
  
    const videoWorker = new Worker("./src/workers/upload.worker.js", {
      workerData: { videoFile, thumbnail },
    })

    videoWorker.on("message", async (data) => {
      if (data.error) {
        cleanUploadedfiles(req.files)
        return res.status(400).json(new apiError(400, data.error));
      }

      const { video, thumbnailUrl } = data;

      const uploadedVideo = await videoModel.create({
        title,
        description,
        url: video.url ?? "",
        thumbnail: thumbnailUrl.url ?? "",
        duration: video.duration ?? 0,
        owner: user?._id,
      });      

      return res
      .status(201)
      .json(new apiResponse(201, uploadedVideo, "video uploaded successfully"));

    })

    videoWorker.on('error', () => {
      cleanUploadedfiles(req.files);
      return res.status(400).json(new apiError(400, "error while uploading video"));
    })

    videoWorker.postMessage('start');
    
  } catch (error) {
    cleanUploadedfiles(req.files);
    return res
      .status(400)
      .json({ message: error.message && "error while uploading video" });
  }
});

const videoDetails = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const user = req.user;

  // await videoModel.updateOne(
  //   { _id: new mongoose.Types.ObjectId(videoId) },
  //   { $inc: { views: 1 } }
  // );
	// let cacheKey = `videoDeatils:${videoId}`
  // const cacheValue = await redis.get(cacheKey);

  // if(cacheValue){
  //   return res.status(200).json(new apiResponse(200, JSON.parse(cacheValue), "success"));
  // }

  const videoDetails = await videoModel.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(videoId) } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "owner._id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $addFields: {
        owner: { $arrayElemAt: ["$owner", 0] },
        likesCount: { $size: { $ifNull: ["$likes", []] } },
        subscribersCount: { $size: { $ifNull: ["$subscribers", []] } },
        isSubscribed: {
          $cond: {
            if: { $in: [user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
        isLiked: {
          $cond: {
            if: { $in: [user?._id, "$likes.likedBy"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        title: 1,
        description: 1,
        thumbnail: 1,
        url: 1,
        owner: {
          _id: 1,
          fullname: 1,
          username: 1,
          avatar: 1 ?? "",
        },
        isSubscribed: 1,
        isLiked: 1,
        likesCount: 1,
        subscribersCount: 1,
        createdAt: 1,
        views: 1,
        isPublished: 1,
        duration: 1,
      },
    },
  ]);

  if (videoDetails.length === 0) {
    return res.status(400).json({ message: "video not found" });
  }

  // await redis.set(cacheKey, JSON.stringify(videoDetails[0]), 'EX', 30);
  
  return res.status(200).json(new apiResponse(200, videoDetails[0], "success"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  const thumbnail = req.file?.path;
  if (!videoId) {
    return res.status(400).json({ message: "cant find video id" });
  }

  const authenticatedId = req.user?._id;
  if (!authenticatedId) {
    return res.status(400).json({ message: "user not found" });
  }

  try {
    const video = await videoModel.findOne({
      _id: videoId,
      owner: authenticatedId,
    });

    if (!video) {
      throw new apiError(401, "video not found");
    }

    const oldThumbnail = video.thumbnail;

    if (title && title.length > 0) {
      video.title = title;
    }

    if (description && description.length > 0) {
      video.description = description;
    }

    if (thumbnail) {
      const uploadWorker = new Worker('./src/workers/upload.worker.js', {
        workerData: { thumbnail },
      })

      uploadWorker.on('message', async (data) => {
        if (data.error) {
          return res.status(400).json(new apiError(400, data.error));
        }
        const { thumbnailUrl } = data;
        if (!thumbnailUrl) {
          throw new apiError(401, "error while uploading on cloudinary");
        }
        video.thumbnail = thumbnailUrl.url;

        if (oldThumbnail) {
          deletOnCloudanry(getPublicId(oldThumbnail));
        }
      })
    }

    await video.save();

    const sendResData = {
      _id: video._id,
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail,
    };

    return res
      .status(200)
      .json(
        new apiResponse(200, sendResData, "video details updated successfully")
      );
  } catch (error) {
    throw new apiError(401, "error  updating video's details" + error.message);
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  try {
    if (!videoId) {
      return res.status(401).json(new apiError(401, "Can't find video id"));
    }

    const deletedVideo = await videoModel.findOneAndDelete({
      _id: videoId,
      owner: req.user?._id,
    });

    if (deletedVideo && deletedVideo.videoFile) {
      deletOnCloudanry(getPublicId(deletedVideo.videoFile));
    } else {
      throw new apiError(401, "Video not found");
    }

    return res
      .status(200)
      .json(new apiResponse(200, "Video deleted successfully"));
  } catch (error) {
    console.error(
      "Error in video.controller.js on deleteVideo controller:",
      error
    );
    throw new apiError(401, "Error while deleting video: " + error.message);
  }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new apiError(401, "cant find video id");
  }

  try {
    const authenticatedId = req.user?._id;

    const video = await videoModel.findByIdAndUpdate(
      {
        _id: videoId,
        owner: authenticatedId,
      },
      {
        $set: {
          isPublished: !video.isPublished,
        },
      }
    );

    const sendResData = {
      _id: video._id,
      isPublished: video.isPublished,
    };

    return res
      .status(200)
      .json(
        new apiResponse(200, sendResData, "video status updated successfully")
      );
  } catch (error) {
    return res.status(400).json(new apiError(400, error.message));
  }
});

export {
  videoUpload,
  updateVideo,
  deleteVideo,
  videoDetails,
  togglePublishStatus,
  getAllVideos,
  getUserVideos,
};
