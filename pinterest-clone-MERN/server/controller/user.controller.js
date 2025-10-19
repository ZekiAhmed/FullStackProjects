import User from "../models/user.model.js";
// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username });

  const { hashedPassword, ...detailsWithoutPassword } = user.toObject();

  // const followerCount = await Follow.countDocuments({ following: user._id });
  // const followingCount = await Follow.countDocuments({ follower: user._id });

  // const token = req.cookies.token;

  // if (!token) {
  //   res.status(200).json({
  //     ...detailsWithoutPassword,
  //     followerCount,
  //     followingCount,
  //     isFollowing: false,
  //   });
  // } else {
  //   jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
  //     if (!err) {
  //       const isExists = await Follow.exists({
  //         follower: payload.userId,
  //         following: user._id,
  //       });

  //       res.status(200).json({
  //         ...detailsWithoutPassword,
  //         followerCount,
  //         followingCount,
  //         isFollowing: isExists ? true : false,
  //       });
  //     }
  //   });
  // }

      res.status(200).json(detailsWithoutPassword);
};