import express from "express";
import { verifyToken } from "../Middleware/verifyToken.js";
import cors from 'cors'
import {
  userRegister,
  login,
  getallUser,
  getuserByid,
  upadteUserbyId,
  deleteUserById,
  sendEmail,
  resetPassword,
  changePassword,
} from "../Controllers/userController.js";
let userRoute = express();
userRoute.use(cors())

userRoute.post("/register", userRegister);
userRoute.post("/login", login);
userRoute.get("/getalluser", getallUser);
userRoute.get("/getuserbyid", verifyToken, getuserByid);
userRoute.post("/updateuserbyid", verifyToken, upadteUserbyId);
userRoute.delete("/deleteUserById", verifyToken, deleteUserById);
userRoute.post("/sendmail", sendEmail);
userRoute.post("/resetpassword", resetPassword);
userRoute.post("/changepassword", verifyToken, changePassword);
export default userRoute;
