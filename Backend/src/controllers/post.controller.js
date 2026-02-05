import { uploadFile } from "../services/storage.service.js"
import { generateCaption } from "../services/ai.service.js"
import { v4 as uuidv4 } from "uuid"
import { createPost, getPosts, incrementLikeCount } from "../dao/post.dao.js"
import { createComment, } from "../dao/comment.dao.js"
import { createLike, isLikeExists, deleteLike } from "../dao/like.dao.js"

/* image , mentions? */

export async function createPostController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image received" });
    }

    const { mentions } = req.body;

    // ✅ parse mentions safely
    let mentionsParsed = [];
    try {
      mentionsParsed = mentions ? JSON.parse(mentions) : [];
    } catch {
      mentionsParsed = [];
    }

    // ✅ upload image safely
    let uploadedFile;
    try {
      uploadedFile = await uploadFile(req.file, uuidv4());
    } catch (err) {
      console.log("IMAGEKIT ERROR:", err.message);
      return res.status(500).json({ message: "Image upload failed" });
    }

    // ✅ AI caption optional
    let caption = "A moment worth sharing ✨";
    try {
      caption = await generateCaption(req.file);
    } catch {
      console.log("Caption fallback used");
    }

    const post = await createPost({
      mentions: mentionsParsed,
      url: uploadedFile.url,
      caption,
      user: req.user._id,
    });

    return res.status(201).json({
      message: "Post created successfully",
      post,
    });

  } catch (error) {
    console.log("POST ERROR:", error);
    return res.status(500).json({ message: "Post failed" });
  }
}


export async function getPostController(req, res) {
    const posts = await getPosts(req.query.skip, Math.min(req.query.limit, 20))

    return res.status(200).json({
        message: "Posts fetched successfully",
        posts
    })

}

export async function createCommentController(req, res) {
    const { post, text } = req.body
    const user = req.user

    const comment = await createComment({
        user: user._id,
        post,
        text
    })

    return res.status(201).json({
        message: "Comment created successfully",
        comment
    })
}


export async function createLikeController(req, res) {
    const { post } = req.body
    const user = req.user

    const isLikeAlreadyExists = await isLikeExists({ user: user._id, post })

    if (isLikeAlreadyExists) {
        await deleteLike({ user: user._id, post })
        await incrementLikeCount(post, -1)
        return res.status(200).json({
            message: "Like removed successfully",
            isLiked: false,
        })
    }

    await incrementLikeCount(post, 1)

    const like = await createLike({ user: user._id, post })

    res.status(201).json({
        message: "Post liked successfully",
        like,
        isLiked: true
    })

}