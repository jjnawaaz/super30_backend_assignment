import { Router } from "express";
import {
  CancelUserBooking,
  CompleteUserBooking,
  DeleteUserBooking,
  GetUserBooking,
  UserBooking,
  UserLogin,
  UserLogOut,
  userSignUp,
} from "../controllers/userController";
import { verifyJWT } from "../middlewares/jwtVerify";

const router = Router();

router.post("/signup", userSignUp);
router.post("/login", UserLogin);
router.post("/logout", UserLogOut);
router.post("/booking", verifyJWT, UserBooking);
router.get("/booking", verifyJWT, GetUserBooking);
router.put("/cancelbooking/:id", verifyJWT, CancelUserBooking);
router.put("/completebooking/:id", verifyJWT, CompleteUserBooking);
router.put("/deletebooking/:id", verifyJWT, DeleteUserBooking);

export default router;
