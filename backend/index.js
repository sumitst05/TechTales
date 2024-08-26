import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import "dotenv/config";

const app = express();

const port = process.env.PORT || 3000;

const __dirname = path.resolve();

import indexRouter from "./routes/index.js";
import articleRouter from "./routes/articles.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/users.js";
import commentRouter from "./routes/comments.js";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"https://tech-tales-io.vercel.app",
			"https://techtales-564.firebaseapp.com",
		],
		credentials: true,
	}),
);

app.use(cookieParser());

app.use("/api", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/articles", articleRouter);
app.use("/api/comment", commentRouter);

app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
});

mongoose
	.connect(process.env.DB_URL)
	.then(
		app.listen(port, () => {
			console.log(`Listening on port ${port}...`);
		}),
	)
	.catch((error) =>
		console.log(`Error while connecting to database: ${error}`),
	);
