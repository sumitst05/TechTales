import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import User from "../models/user.js";

export const signup = async (req, res) => {
	const { username, email, password } = req.body;

	try {
		if (!username || !email || !password) {
			return res.status(400).json({ message: "Invalid credentials!" });
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
	const { email, password } = req.body;

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
			{ expiresIn: "1h" },
		);

		res.status(200).json({ token, id: user._id });
	} catch (error) {
		res.status(500).json({ message: "Internal server error!" });
	}
};
