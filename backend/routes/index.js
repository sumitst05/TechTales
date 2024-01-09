import express from "express"

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ result: "Server is working!" })
})

export default router
