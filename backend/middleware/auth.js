import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
	const token = req.cookies.access_token;

	if (!token) {
		return res
			.status(401)
			.json({ message: "Unauthenticated. Please sign in first." });
	}

	jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
		if (error) {
			return res.status(403).json({ message: "Token is not valid!" });
		}

		req.user = user;

		next();
	});
};
