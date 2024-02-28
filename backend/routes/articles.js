import express from "express";

import {
	getArticles,
	getMyArticles,
	getArticleById,
	createArticle,
	updateArticle,
	deleteArticle,
	getTags,
	likeArticle,
} from "../controllers/articles.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getArticles);
router.get("/myarticles", auth, getMyArticles);
router.post("/", auth, createArticle);
router.get("/tags", getTags);
router.get("/:id", getArticleById);
router.patch("/:id", auth, updateArticle);
router.delete("/:id", auth, deleteArticle);
router.patch("/like/:id", likeArticle);

export default router;
