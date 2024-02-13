import { Router } from "express";

import {
	updateUser,
	deleteUser,
	getUser,
	getBookmarkedArticles,
	getLikedArticles,
} from "../controllers/users.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/", getUser);
router.get("/bookmarks/:id", auth, getBookmarkedArticles);
router.get("/liked/:id", auth, getLikedArticles);
router.patch("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

export default router;
