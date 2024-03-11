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
router.post("/", auth, createArticle);
router.get("/tags", getTags);
router.get("/myarticles/:id", auth, getMyArticles);
router.get("/:id", getArticleById);
router.patch("/:id", auth, updateArticle);
router.delete("/:id", auth, deleteArticle);
router.patch("/like/:id", auth, likeArticle);

export default router;
