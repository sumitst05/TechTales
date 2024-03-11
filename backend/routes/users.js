import { Router } from "express";

import {
  updateUser,
  deleteUser,
  getUser,
  getBookmarkedArticles,
  getLikedArticles,
  getUserById,
  getFollowersAndFollowing,
} from "../controllers/users.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/", getUser);
router.get("/follow", auth, getFollowersAndFollowing);
router.patch("/update", auth, updateUser);
router.delete("/delete", auth, deleteUser);
router.get("/bookmarks", auth, getBookmarkedArticles);
router.get("/liked", auth, getLikedArticles);
router.get("/:id", auth, getUserById);

export default router;
