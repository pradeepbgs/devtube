import mongoose, { isValidObjectId } from "mongoose";
import Playlist from "../models/playlist.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  //TODO: create playlist

  if (!name) {
    return res.status(400).json(new apiError(400, "name is required"));
  }

  const authenticatedId = req.user;
  if (!authenticatedId) {
    return res.status(400).json(new apiError(400, "user is not authenticated"));
  }

  const playlist = await Playlist.create({
    name,
    description: description || "",
    owner: authenticatedId?._id,
  });
  if (!playlist) {
    return res.status(400).json(new apiError(400, "playlist is not created"));
  }

  return res
    .status(201)
    .json(new apiResponse(true, playlist, "playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists

  if (!userId) {
    return res.status(400).json(new apiError(400, "user id is required"));
  }

  if (!isValidObjectId(userId)) {
    return res.status(400).json(new apiError(400, "user id is not valid"));
  }

  const playlists = await Playlist.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $lookup: {
        from:'users',
        localField:'owner',
        foreignField:'_id',
        as:'owner'
      }
    },
    {
      $lookup:{
        from:'videos',
        localField:'videos',
        foreignField:'_id',
        as:'videos',
      }
    },
    {
      $unwind:'$owner'
    },
    {
      $project:{
        name:1,
        description:1,
        videoCount: { $size: { $ifNull: ['$videos', []] } },
        owner:{
          username:1,
          fullname:1,
          avatar:1
        }
      }
    }
  ])

  if (!playlists) {
    return res.status(400).json(new apiError(400, "playlists not found"));
  }

  return res
    .status(200)
    .json(new apiResponse(200, playlists, "playlists found successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  // Validate playlistId
  if (!playlistId || !mongoose.isValidObjectId(playlistId)) {
    return res
      .status(400)
      .json(new apiError(400, "Playlist ID is not valid or required"));
  }

  try {
    const playlistInfo = await Playlist.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(playlistId),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "videos",
          foreignField: "_id",
          as: "videos",
        },
      },
      {
        $project: {
          videos: {
            $map: {
              input: "$videos",
              as: "video",
              in: {
                _id: "$$video._id",
                title: "$$video.title",
                thumbnail: "$$video.thumbnail",
                duration: "$$video.duration",
                createdAt: "$$video.createdAt",
                views: "$$video.views",
                isPublished: "$$video.isPublished",
              },
            },
          },
        },
      },
    ]);

    if (playlistInfo.length === 0) {
      return res.status(404).json(new apiError(404, "Playlist not found"));
    }

    return res
      .status(200)
      .json(new apiResponse(200, playlistInfo[0], "Playlist found successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new apiError(500, "Internal Server Error", error.message));
  }
});


const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!playlistId || !isValidObjectId(playlistId)) {
    return res.status(400).json(new apiError(400, "playlist id is required OR playlist id is not valid"));
  }

  if (!isValidObjectId(videoId) || !videoId) {
    return res.status(400).json(new apiError(400, "video id is not valid or required"));
  }

  const playlist = await Playlist.findByIdAndUpdate(
    {
      _id: playlistId,
      owner: req.user?._id,
    },
    {
      $push: { videos: videoId },
    },
    {
      new: true, // Return the updated document
      runValidators: true, // Run validators on the update operation
    }
  );

  return res
    .status(200)
    .json(
      new apiResponse(200, playlist, "video added to playlist successfully")
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
  if (
    !playlistId ||
    !isValidObjectId(playlistId) ||
    !videoId ||
    !isValidObjectId(videoId)
  ) {
    return res.status(400).json(new apiError(400, "Invalid playlist or video ID"));
  }

  const authenticatedId = req.user;

  const playlist = await Playlist.findOneAndUpdate(
    {
      _id: playlistId,
      owner: authenticatedId?._id,
    },
    {
      $pull: { videos: videoId },
    },
    { new: true }
  );
  if (!playlist) {
    return res.status(400).json(new apiError(400, "playlist not found"));
  }

  return res
    .status(200)
    .json(new apiResponse(200, "video removed from playlist successfully"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  if (!playlistId || !isValidObjectId(playlistId)) {
    return res.status(400).json(new apiError(400, "Invalid playlist ID"));
  }
  const playlist = await Playlist.findOneAndDelete({
    _id: playlistId,
    owner: req.user?._id,
  });

  if (!playlist) {
    return res.status(400).json(new apiError(400, "playlist not found"));
  }

  return res
    .status(200)
    .json(new apiResponse(200, "playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
  if (!playlistId || !isValidObjectId(playlistId)) {
    return res.status(400).json(new apiError(400, "Invalid playlist ID"));
  }

  const playlist = await Playlist.findOne({
    _id: playlistId,
    owner: req.user?._id,
  });

  if (name) {
    playlist.name = name;
  }
  if (description) {
    playlist.description = description;
  }
  await playlist.save();

  return res
    .status(200)
    .json(new apiResponse(200, "playlist updated successfully"));
});



export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};


