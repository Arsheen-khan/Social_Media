import postModel from "../models/post.model.js"
import userModel from "../models/user.model.js"

export async function createPost(data) {
  const { mentions, url, caption, user } = data;

  const mentionsString =
    Array.isArray(mentions)
      ? mentions.join(",")
      : typeof mentions === "string"
      ? mentions
      : "";

  const mentionIds = (
    await Promise.all(
      mentionsString
        .split(",")
        .map(u => u.trim())
        .filter(Boolean)
        .map(async username => {
          const foundUser = await userModel.findOne({ username });
          return foundUser ? foundUser._id : null;
        })
    )
  ).filter(Boolean); // 👈 removes nulls

  return await postModel.create({
    image: url,
    caption,
    user,
    mentions: mentionIds,
  });
}



export async function incrementLikeCount(postId, incrementBy) {
    return await postModel.findByIdAndUpdate(postId, { $inc: { likeCount: incrementBy } })
}

export async function getPosts(skip = 0, limit = 10) {

    const posts = await postModel
        .find()
        .sort({ createdAt: -1 }) // Sort by creation date, newest first
        .skip(skip)
        .limit(limit)
        .populate("user")


    return posts
}

