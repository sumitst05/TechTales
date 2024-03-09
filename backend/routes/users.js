import { Router } from "express";

import {
	updateUser,
	deleteUser,
	getUser,
	getBookmarkedArticles,
	getLikedArticles,
	getUserById,
} from "../controllers/users.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/", getUser);
router.get("/bookmarks/:id", auth, getBookmarkedArticles);
router.get("/liked/:id", auth, getLikedArticles);
router.get("/:id", auth, getUserById);
router.patch("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

export default router;
