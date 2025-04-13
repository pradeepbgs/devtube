import { OTP } from "../models/otp.model";
import { User } from "../models/user.model";
import MailService from "../service/mail.service";
import Service from "../service/service";
import { asyncHandler } from "../utils/asyncHandler";
import {apiError} from '../utils/apiError'
import {apiResponse} from '../utils/apiResponce'
import bcrypt from 'bcrypt';


const resetTokens = new Map();
const mailService = new MailService()
export const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser && existingUser.isVerified) {
    return res.status(409).json({ message: "User already exists with this username or email" });
  }


  let user;
  if (existingUser && !existingUser.isVerified) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.findByIdAndUpdate(
      existingUser._id,
      {
        $set: {
          fullname,
          email,
          password: hashedPassword,
          username: username.toLowerCase(),
        },
      },
      { new: true }
    );
  } else {
    user = await User.create({
      fullname,
      email,
      password,
      username: username.toLowerCase(),
    });
  }

  if (!user) {
    console.log("user creation failed")
    return ctx.json({ status: 500, message: "User creation failed" }, 500);
  }

  const otp = Service.generateOTP()
  await OTP.findOneAndUpdate(
    { email },
    { otp, createdAt: new Date() },
    { upsert: true, new: true }
  );
  mailService.sendOtp('SIGNUP', email, otp)

  return res.status(201).json(new apiResponse(201, null, " OTP sent to email."));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!(username || email)) {
    res.status(400).json({ message: "Username or email is required" });
    throw new apiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    return res.status(404).json(new apiResponse(404, {}, "User not found"));
    // throw new apiError(404, "User not found")
  }

  if (!user.isVerified) {
    return res.status(403).json(new apiResponse(403, {}, "Account not verified. Please verify your email."));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return res.status(401).json({
      message: "invalid user password",
    });
  }

  const { accesToken, refreshToken } = await Service.generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };
  return res
    .status(200)
    .cookie("accessToken", accesToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser,
          accessToken: accesToken,
          refreshToken: refreshToken,
        },
        "User logged in successfully"
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  // clear cookie
  // await User.findByIdAndUpdate(
  //   req.user?._id,
  //   {
  //     $unset: {
  //       refreshToken: 1,
  //     },
  //   },
  //   {
  //     new: true,
  //   }
  // );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "user logged out"));
});


export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) throw new apiError(401, "unauthorized request");

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    if (incomingRefreshToken !== user.refreshToken)
      throw new apiError(401, "refresh token is expired or used");

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accesToken, newRefreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accesToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new apiResponse(
          200,
          { accesToken, refreshToken: newRefreshToken },
          "Access Token refreshed successfully"
        )
      );
  } catch (error) {
    res
      .status(400)
      .json({ message: "something went wrong while refreshing access token" });
    throw new apiError(
      401,
      error?.message || "something went wrong while refreshing access token"
    );
  }
});

export const requestVerificationOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ status: 400, message: "Email is required" });
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ status: 400, message: "User already verified" });
        }

        const otp = this.generateOTP();
        await OTP.findOneAndUpdate(
            { email },
            { otp, createdAt: new Date() },
            { upsert: true, new: true }
        );
        mailService.sendOtp('VERIFICATION', email, otp)
        return res.json({ status: 200, message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error in requestVerificationOtp:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
};

export const verifyOtpAndActivateUser = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ status: 400, message: "Email and OTP are required" });
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ status: 400, message: "User is already verified" });
        }

        const otpEntry = await OTP.findOne({ email });
        if (!otpEntry) {
            return res.status(400).json({ status: 400, message: "OTP expired or invalid" });
        }

        if (otpEntry.otp !== otp) {
            return res.status(400).json({ status: 400, message: "Invalid OTP" });
        }

        user.isVerified = true;
        await user.save();

        await OTP.deleteOne({ email });
        return res.json({ status: 200, message: "User verified successfully" });
    } catch (error) {
        console.error("Error in verifyOtpAndActivateUser:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
};


/**
 * 🔹 Verify OTP Service
 */
export const VerifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const otpEntry = await OTP.findOne({ email });
        if (!otpEntry || otpEntry.otp !== otp) {
            return res.status(400).json({ status: 400, message: "OTP expired or incorrect" });
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ status: 400, message: "User is already verified" });
        }

        await User.findOneAndUpdate({email},{isVerified:true})

        await OTP.deleteOne({ email });
        return res.json({ message: "OTP verified successfully" });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Something went wrong while verifying user OTP" });
    }
};

export const RequestPasswordReset = async (ctx) => {
    try {
        const { email } = await ctx.body;

        if (!email)
            return ctx.json({ status: 400, message: "Email is required" }, 400);

        const user = await User.findOne({ email })
        if (!user)
            return ctx.json({ status: 400, message: "User not found" }, 400);

        if (!user.isVerified)
            return ctx.json({ status: 400, message: "User is not verified" }, 400);

        const token = crypto.randomBytes(32).toString("hex");
        resetTokens.set(token, email);
        setTimeout(() => resetTokens.delete(token), 300000);
        
        const resetLink = process.env.AUTH_SERVICE_URI + `/api/v1/auth/reset-password?token=${token}`
        mailService.sendPasswordResetEmail('PASSWORD_RESET', email, resetLink)

        return ctx.json({ message: "Password reset link sent to email" }, 200);
    } catch (error) {
        console.error("Reset Password Error:", error);
        return ctx.json({ status: 500, message: "Something went wrong while resetting password" }, 500)
    }
}

export const ServeResetPasswordForm = async (req, res) => {
    try {
        const token = req.query.token?.trim();
        if (!token) {
            return res.status(400).json({ status: 400, message: "Token is required" });
        }

        const email = resetTokens.get(token);
        if (!email) {
            return res.status(400).json({ status: 400, message: "Token is expired or invalid" });
        }

        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.setHeader("Content-Type", "text/html");
        return res.render('./src/views/reset-password-form.ejs', { token: token });
    } catch (error) {
        console.error("Reset Password Error:", error);
        return res.status(500).json({ status: 500, message: "Something went wrong while resetting password" });
    }
};

export const ResetPassword = async (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({ status: 400, message: "Body is required" });
    }
    try {
        const { token, newPassword } = body;
        if (!token || !newPassword) {
            return res.status(400).json({ status: 400, message: "Token and new password required" });
        }

        const email = resetTokens.get(token);
        if (!email) {
            return res.status(400).json({ status: 400, message: "Token is expired or invalid" });
        }

        const user = await this.userRepository.FindByEmail(email);
        if (!user) {
            return res.status(400).json({ status: 400, message: "User not found" });
        }

        if (!user.isVerified) {
            return res.status(400).json({ status: 400, message: "User is not verified" });
        }

        // our user model has logic so it will be hashed before saving into db
        user.password = newPassword;
        await user.save();
        resetTokens.delete(token);
        return res.json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Reset Password Error:", error);
        return res.status(500).json({ status: 500, message: "Something went wrong while resetting password" });
    }
};
