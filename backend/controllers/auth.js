import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import User from "../models/user.js";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const existingUsername = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUsername || existingEmail) {
      return res.status(403).json({ message: "User already exists!" });
    }

    const salt = 12;
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User created successfully! " });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const signin = async (req, res) => {
  const { email, password, remember } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const { password: hashedPassword, ...validatedUser } = user._doc;

    const token = jwt.sign(
      { id: validatedUser._id },
      process.env.TOKEN_SECRET,
      { expiresIn: remember ? "30d" : "1d" },
    );

    res
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: remember ? 1024 * 60 * 60 * 24 * 30 : 1024 * 60 * 60 * 24,
        sameSite: "none",
      })
      .status(200)
      .json(validatedUser);
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      const token = jwt.sign(
        { id: existingUser._id },
        process.env.TOKEN_SECRET,
        { expiresIn: "30d" },
      );

      const { password: hashedPassword, ...user } = existingUser._doc;

      res
        .cookie("access_token", token, {
          httpOnly: true,
          maxAge: 1024 * 60 * 60 * 24 * 30,
          sameSite: "none",
        })
        .status(200)
        .json(user);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedGeneratedPassword = await bcrypt.hash(generatedPassword, 12);

      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.floor(Math.random() * 1000).toString(),
        email: req.body.email,
        password: hashedGeneratedPassword,
        profilePicture: req.body.photo,
      });

      await newUser.save();

      const { password: hashedPassword, ...user } = newUser._doc;

      const token = jwt.sign({ id: newUser._id }, process.env.TOKEN_SECRET, {
        expiresIn: "30d",
      });

      res
        .cookie("access_token", token, {
          httpOnly: true,
          maxAge: 1024 * 60 * 60 * 24 * 30,
          sameSite: "none",
        })
        .status(200)
        .json(user);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const signout = (req, res) => {
  res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Signed out successfully!" });
};
