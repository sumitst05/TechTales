import { Router } from "express";

import {
	updateUser,
	deleteUser,
	getUser,
	getBookmarkedArticles,
	getLikedArticles,
	getUserById,
	getFollowersAndFollowing,
	follow,
} from "../controllers/users.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/", getUser);
router.patch("/update", auth, updateUser);
router.delete("/delete", auth, deleteUser);
router.get("/bookmarks", auth, getBookmarkedArticles);
router.get("/liked", auth, getLikedArticles);
router.get("/followers-following/:id", auth, getFollowersAndFollowing);
router.get("/:id", auth, getUserById);
router.patch("/follow/:id", auth, follow);

export default router;
