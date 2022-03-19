import express from "express";
import {
  getEdit,
  postEdit,
  logout,
  seeUserProfile,
  getChangePassword,
  postChangePassword,
  startGithubLogin,
  FinishGithubLogin
} from "../controllers/userController";
import {
  protectorMiddleware,
  publicOnlyMiddleware,
  avatarUpload,
} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(avatarUpload.single("avatar"), postEdit);
userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);

userRouter.get("/github/start", startGithubLogin)
userRouter.get("/github/finish", FinishGithubLogin)

userRouter.get("/:id", seeUserProfile);

export default userRouter;