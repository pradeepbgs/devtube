import { Worker } from "worker_threads";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import {
  deletOnCloudanry,
  getPublicId,
} from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponce.js";
import mongoose from "mongoose";




export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    res.status(400).json({ message: "Old password is incorrect" });
    throw new apiError(400, "Old password is incorrect");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Password changed successfully"));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select("-password");

  return res
    .status(200)
    .json(new apiResponse(200, user, "User fetched successfully"));
});

export const updateAccountDetail = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;

  if (!(fullname || email)) {
    res.status(400).json({ message: "fullname or email is required" });
    throw new apiError(400, "fullname or email is required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname,
        email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new apiResponse(200, user, "Account details updated successfully"));
});

export const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalpath = req.file?.path;
  try {
    if (!avatarLocalpath) return new apiError(400, "Avatar file is missing");

    const currentUser = await User.findById(req.user?._id);

    if (!currentUser) {
      res.status(404).json({ message: "User not found" });
      throw new apiError(404, "User not found");
    }

    const publicId = getPublicId(currentUser.avatar);

    const uploadWorker = new Worker("./src/workers/upload.worker.js", {
      workerData: { avatarLocalpath },
    });

    uploadWorker.on("message", async (data) => {
      if (data.error) {
        return res
          .status(400)
          .json(new apiResponse(400, {}, "error while updating avatar"));
      }
      const avatar = data.avatar;

      const user = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: { avatar: avatar.url } },
        { new: true, select: "-password" }
      );

      if (user) {
        deletOnCloudanry(publicId);
      }

      return res
        .status(200)
        .json(new apiResponse(200, user, "Avatar image updated successfully"));
    });
  } catch (error) {
    res.status(400).json({ message: "Error while updating Avatar image" });
    throw new apiError(
      401,
      error?.message || "Error while updating Avatar image "
    );
  }
});

export const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalpath = req.file?.path;
  try {
    if (!coverImageLocalpath)
      return new apiError(400, "Cover image file is missing");

    const currentUser = await User.findById(req.user?._id);

    if (!currentUser) {
      res.status(404).json({ message: "User not found" });
      throw new apiError(404, "User not found");
    }
    const publicId = getPublicId(currentUser.coverImage);

    const uploadWorker = new Worker(".src/workers/upload.worker.js", {
      workerData: { coverImageLocalpath },
    });
    uploadWorker.on("message", async (data) => {
      if (data.error) {
        return res
          .status(400)
          .json(new apiResponse(400, {}, "error while updating cover image"));
      }
      const coverImage = data.coverImage;

      const user = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: { coverImage: coverImage.url } },
        { new: true, select: "-password" }
      );

      if (user) {
        deletOnCloudanry(publicId);
      }

      return res
        .status(200)
        .json(
          new apiResponse(200, user, "CoverImage image updated successfully")
        );
    });
  } catch (error) {
    res.status(400).json({ message: "Error while updating Cover image" });
    throw new apiError(
      401,
      error?.message || "Error while updating Cover image "
    );
  }
});

export const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    res.status(400).json({ message: "Username is required" });
    throw new apiError(400, "Username is required");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        subscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        subscribersCount: 1,
        subscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {
    res.status(404).json({ message: "Channel not found" });
    throw new apiError(404, "Channel not found");
  }

  return res
    .status(200)
    .json(
      new apiResponse(200, channel[0], "User channel fetched successfully")
    );
});

export const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "Video",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "User",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        user[0].watchHistory,
        "Watch History fetched successfully"
      )
    );
});


