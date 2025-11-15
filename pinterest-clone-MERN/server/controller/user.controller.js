import User from "../models/user.model.js";
import Follow from "../models/follow.model.js";
import bcrypt from "bcryptjs";
import Imagekit from "imagekit";
import jwt from "jsonwebtoken";


export const registerUser = async (req, res) => {
  const { username, displayName, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const newHashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    displayName,
    email,
    hashedPassword: newHashedPassword,
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  const { hashedPassword, ...detailsWithoutPassword } = user.toObject();

  res.status(201).json(detailsWithoutPassword);
};




export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);

  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  const { hashedPassword, ...detailsWithoutPassword } = user.toObject();

  res.status(200).json(detailsWithoutPassword);
};




export const logoutUser = async (req, res) => {
  res.clearCookie("token");

  res.status(200).json({ message: "Logout successful" });
};




export const getUser = async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username });

  const { hashedPassword, ...detailsWithoutPassword } = user.toObject();

  const followerCount = await Follow.countDocuments({ following: user._id });
  const followingCount = await Follow.countDocuments({ follower: user._id });

  const token = req.cookies.token;

  if (!token) {
    res.status(200).json({
      ...detailsWithoutPassword,
      followerCount,
      followingCount,
      isFollowing: false,
    });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
      if (!err) {
        const isExists = await Follow.exists({
          follower: payload.userId,
          following: user._id,
        });

        res.status(200).json({
          ...detailsWithoutPassword,
          followerCount,
          followingCount,
          isFollowing: isExists ? true : false,
        });
      }
    });
  }
};



export const followUser = async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username });

  const isFollowing = await Follow.exists({
    follower: req.userId,
    following: user._id,
  });

  if (isFollowing) {
    await Follow.deleteOne({ follower: req.userId, following: user._id });
  } else {
    await Follow.create({ follower: req.userId, following: user._id });
  }

  res.status(200).json({ message: "Successful" });
};


export const addProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!req.files || !req.files.media) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const media = req.files.media;

    const imagekit = new Imagekit({
      publicKey: process.env.IK_PUBLIC_KEY,
      privateKey: process.env.IK_PRIVATE_KEY,
      urlEndpoint: process.env.IK_URL_ENDPOINT,
    });

    const response = await imagekit.upload({
      file: media.data,
      fileName: media.name,
      folder: "profile_images",
    });

    // Use filePath returned by ImageKit (consistent with pin.controller)
    user.img = response.filePath;
    await user.save();

    const { hashedPassword, ...detailsWithoutPassword } = user.toObject();
    return res.status(200).json(detailsWithoutPassword);
  } catch (err) {
    console.error("addProfileImage error:", err);
    return res.status(500).json({ message: "Upload failed", error: err });
  }
}





// export const allUser = async (req, res) => {
//   try {
//     const users = await User.find();
//     console.log('users', users);
//     res.status(200).json({
//       success: true,
//       users,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Something went wrong! Please try again",
//     });
//   }
// }