import { Router } from "express";

import { updateUser, deleteUser, getUser } from "../controllers/users.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/", getUser);
router.patch("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

export default router;
