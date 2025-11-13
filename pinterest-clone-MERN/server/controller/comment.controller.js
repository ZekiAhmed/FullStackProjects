import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";


export const getPostComments = async (req, res) => {
  const { postId } = req.params;

  const comments = await Comment.find({ pin: postId })
    .populate("user", "username img displayName")
    .sort({ createdAt: -1 });

  res.status(200).json(comments);
};

export const addComment = async (req, res) => {
  const { description, pin } = req.body;

  const userId = req.userId;
  const comment = await Comment.create({ description, pin, user: userId });

  res.status(201).json(comment);
};

// TODO: deleteComment 
export const deleteComment = async (req, res) => {
  const { id } = req.params;
  console.log("Deleting comment with ID:", id);

  const comments = await Comment.deleteOne({ _id: id });

  res.status(200).json(comments);
};