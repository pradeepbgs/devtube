import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Subscription as subscriptionModel } from "../models/subscription.model.js";
import { apiResponse } from "../utils/apiResponce.js";
import mongoose from "mongoose";

const toggleSubscription = asyncHandler(async (req, res) => {
  // TODO: toggle subscription
  const { channelId } = req.params;
  const user = req.user;
  if (!user) {
    return res.status(401).json(new apiError(401, "user not found"));
  }
  if (!mongoose.isValidObjectId(channelId) || !channelId) {
    return res.status(401).json(new apiError(401, "channel not found"));
  }

  const existingSubscription = await subscriptionModel.findOneAndDelete({
    subscriber: user?._id,
    channel: channelId,
  });

  let message = "";
  let newsubscription = null;

  if (existingSubscription) {
    message = "unsubscribed successfully";
  } else {
    newsubscription = await subscriptionModel.create({
      subscriber: user?._id,
      channel: channelId,
    });
    message = "subscribed successfully";
  }

  return res.status(200).json(new apiResponse(200, newsubscription, message));
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const subscribers = await subscriptionModel.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $project: {
        subscriber: 1,
      },
    },
  ]);

  if (subscribers.length === 0) {
    return res.status(400).json(new apiError(400, "cant find subscribers"));
  }

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        subscribers[0],
        "user subscribers fetched successfully"
      )
    );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  const channels = await subscriptionModel.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(req.user._id || subscriberId),
      },
    },
    {
      $project: {
        channel: 1,
      },
    },
  ]);

  if (channels.length === 0) {
    return res.status(400).json(new apiError(400, "cant find subscribers"));
  }

  return res
    .status(200)
    .json(
      new apiResponse(200, channels, "user subscribers fetched successfully")
    );
});


export { 
    toggleSubscription, 
    getSubscribedChannels, 
    getUserChannelSubscribers 
}
