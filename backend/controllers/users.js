import bcrypt from "bcryptjs";

import User from "../models/user.js";

export const getUser = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    const users = await User.find().limit(3);
    return res.status(200).json(users);
  }

  try {
    const users = await User.find({
      username: { $regex: query, $options: "i" },
    }).limit(3);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const updateUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(401).json({ message: "Acess denied!" });
  }

  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 12);
    }

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        profilePicture: req.body.profilePicture,
        likedArticles: req.body.likedArticles,
      },
      { new: true },
    );

    const { password, ...user } = updateUser._doc;

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const deleteUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(401).json({ message: "Access denied!" });
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
};
