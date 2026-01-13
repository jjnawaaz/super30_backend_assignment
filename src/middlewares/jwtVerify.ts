import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../types/authType";

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
  ) as TokenPayload;
  if (!userData) {
    return res.status(401).json({
      message: "Unauthorized user",
      success: false,
    });
  }
  req.user = {
    id: userData.id,
    username: userData.username,
  };
  next();
}
