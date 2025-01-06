require("dotenv").config();
import AppDataSource from "./database";
import express from "express";
import bodyParser from "body-parser";
import { User } from "./src/entity/User";
import { createUser, getAllUsers } from "./src/users/userApi";
import { createPost, deletePostByUserId, getAllPosts, getPostByUserId, updatePostByUserId } from "./src/posts/postsapi";
const app = express();
const port = 3000;
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

AppDataSource.initialize()
  .then(async () => {
    console.log("Data Source has been initialized!");
    const queryRunner = AppDataSource.createQueryRunner();
    const tables = await queryRunner.query("SHOW DATABASES");
    console.log(tables);
    await queryRunner.release();
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
  
  app.post('/users/create',createUser)
  app.post('/posts/create',createPost)
  app.get('/users/all',getAllUsers)
  app.get('/posts/all',getAllPosts)
  app.get('/posts/user/:userId',getPostByUserId)
  app.delete('/posts/:postId/user/:userId', deletePostByUserId)
  app.put('/posts/:postId/user/:userId',updatePostByUserId)

  app.listen(port, () => {
    console.log("Server is running on port 3000");
  });