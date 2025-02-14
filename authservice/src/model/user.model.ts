import mongoose, { Document, Model, Schema, InferSchemaType } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export interface UserMethods {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}


const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/17/17004.png",
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;

  if (!ACCESS_TOKEN_SECRET || !ACCESS_TOKEN_EXPIRY) {
    throw new Error("Access token environment variables are not defined.");
  }

  return jwt.sign({ _id: this._id }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

userSchema.methods.generateRefreshToken = function (): string {
  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
  const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;

  if (!REFRESH_TOKEN_SECRET || !REFRESH_TOKEN_EXPIRY) {
    throw new Error("Refresh token environment variables are not defined.");
  }

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    }
  );
};

type UserDocument = Document & InferSchemaType<typeof userSchema> & UserMethods;
type UserModel = Model<UserDocument>;

export const User = mongoose.model<UserDocument, UserModel>("User", userSchema);
export type { UserDocument, UserModel };
