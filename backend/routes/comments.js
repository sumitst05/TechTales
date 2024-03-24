import express from "express";
import {
	getComments,
	createComment,
	reply,
	deleteComment,
	likeComment,
} from "../controllers/comments.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", auth, getComments);
router.post("/:id", auth, createComment);
router.post("/:commentId/reply/:articleId", auth, reply);
router.patch("/:commentId/like/:articleId", auth, likeComment);
router.delete("/:commentId/delete/:articleId", auth, deleteComment);

export default router;
