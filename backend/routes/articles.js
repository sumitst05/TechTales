import express from "express"

import { getArticles, createArticle, updateArticle, deleteArticle } from "../controllers/articles.js"
import { auth } from "../middleware/auth.js"

const router = express.Router()

router.get('/', getArticles)
router.post('/', auth, createArticle)
router.patch('/:id', auth, updateArticle)
router.delete('/:id', auth, deleteArticle)

export default router
