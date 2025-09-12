import express from "express";
const userRouter = express.Router();

import userAuthVerification from "../middleware/auth-middlware.js";
import { loginUser, logout, registerUser } from "../controllers/user-controller.js";

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/auth", userAuthVerification);
userRouter.post("/logout", logout);

export default userRouter;
