import { Request, Response } from "express";
import AppDataSource from "../../database";
import { Post } from "../entity/Post";
import { User } from "../entity/User";

export const createPost = async (req: Request, res: Response) => {
  const { title, description, userId, images } = req.body;

  try {
    const userRepository = AppDataSource.getRepository(User);
    const postRepository = AppDataSource.getRepository(Post);

    // Check if the user exists
    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      res.status(404).json({ error: "User not found" });
    }

    // Create and save the post
    const newPost = postRepository.create({
      title,
      description,
      userId,
      images,
    });
    const savedPost = await postRepository.save(newPost);

    // Update the user's post count
    if (user) {
      user.postcount += 1;
      await userRepository.save(user);
    }

    res.status(201).json(savedPost);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }

  // const post = new Post();
  // post.title = req.body.title;
  // post.description=req.body.description;
  // post.images=req.body.images;
  // post.userId=req.body.userId;
  // await AppDataSource.manager.save(post);
  // res.send(post);
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const postRepository = AppDataSource.getRepository(Post);

    // Fetch all posts and include their associated user
    const posts = await postRepository.find({ relations: ["user"] });

    res.status(200).json(posts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPostByUserId = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);

  try {
    const postRepository = AppDataSource.getRepository(Post);

    // Fetch posts by user ID and include their associated user
    const posts = await postRepository.find({
      where: { userId: userId },
      relations: ["user"],
    });

    if (posts.length === 0) {
      res.status(404).json({ error: "No posts found for this user" });
    } else {
      res.status(200).json(posts);
    }
  } catch (error: any) {
    console.log(error, ".........");
    res.status(500).json({ error: error.message });
  }
};

export const deletePostByUserId = async (req: Request, res: Response) => {
  const { postId, userId } = req.params;

  try {
    const postRepository = AppDataSource.getRepository(Post);
    const userRepository = AppDataSource.getRepository(User);

    // Check if the post exists and belongs to the given user
    const post = await postRepository.findOneBy({
      id: parseInt(postId),
      userId: parseInt(userId),
    });

    if (!post) {
      res
        .status(404)
        .json({ error: "Post not found or does not belong to the user" });
      return;
    } else {
      // Delete the post
      await postRepository.delete(post.id);
    }

    // Delete the post

    // Update the user's post count
    const user = await userRepository.findOneBy({ id: parseInt(userId) });
    if (user && user.postcount > 0) {
      user.postcount -= 1;
      await userRepository.save(user);
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePostByUserId = async (req: Request, res: Response) => {
  const { postId, userId } = req.params;
  const { title, description, images } = req.body;

  try {
    const postRepository = AppDataSource.getRepository(Post);

    // Check if the post exists and belongs to the given user
    const post = await postRepository.findOneBy({
      id: parseInt(postId),
      userId: parseInt(userId),
    });

    if (!post) {
      res
        .status(404)
        .json({ error: "Post not found or does not belong to the user" });
    } else {
      // Update the post
      if (title) post.title = title;
      if (description) post.description = description;
      if (images) post.images = images;
      const updatedPost = await postRepository.save(post);
      res.status(200).json(updatedPost);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
