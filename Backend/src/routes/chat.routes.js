import express from "express"
import { getChatHistoryController } from "../controllers/chat.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.get(
  '/chat-history/:user1/:user2',
  authMiddleware,
  getChatHistoryController
)

export default router

