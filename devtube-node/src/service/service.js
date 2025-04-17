import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";

export default class Service {


  static generateAccessAndRefreshToken = async (userId) => {
    try {
      const user = await User.findById(userId);
      const accesToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return { accesToken, refreshToken };
    } catch (error) {
      throw new apiError(
        500,
        "something went wrong while generating refresh and access token"
      );
    }
  };

  static generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}