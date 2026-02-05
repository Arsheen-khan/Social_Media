import { getChatHistory } from "../dao/message.dao.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

export async function getChatHistoryController(req, res) {

    const { user1, user2 } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;


    const chatHistory = await getChatHistory(user1, user2, limit, skip);

    res.status(200).json({
        message: "Chat history fetched successfully",
        chatHistory
    });

}