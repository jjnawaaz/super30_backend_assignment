import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthUser } from "../types/authType";

export function verifyJWT(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies[process.env.COOKIE_NAME as string];
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized user",
      success: false,
    });
  }
  const userData = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as AuthUser;
  if (!userData) {
    return res.status(401).json({
      message: "Unauthorized user",
      success: false,
    });
  }
  res.locals.user = userData;
  next();
}
