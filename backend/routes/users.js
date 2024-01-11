import { Router } from "express";

import { updateUser, deleteUser } from "../controllers/users.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.patch("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

export default router;
