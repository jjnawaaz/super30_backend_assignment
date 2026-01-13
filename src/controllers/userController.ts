import type { Request, Response } from "express";
import { prisma } from "../lib/prismaClient";
import { hashPassword } from "../lib/bcrypt";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { UserBooking, UserLoginBody, UserSignUpBody } from "../types/userTypes";
import { TokenPayload } from "../types/authType";

// User Signup

export async function userSignUp(req: Request, res: Response) {
  const { username, password }: UserSignUpBody = req.body;
  if (!username || !password) {
    return res.status(400).json({
      message: "Please send all details",
      success: false,
    });
  }

  try {
    const isExistingUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (isExistingUser) {
      return res.status(409).json({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPassword = await hashPassword(password);
    const createdUser = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });
    return res.status(201).json({
      message: "User Signedup successfully",
      success: true,
      user: createdUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
}

// Login

export async function UserLogin(req: Request, res: Response) {
  const { username, password }: UserLoginBody = req.body;
  if (!username || !password) {
    return res.status(400).json({
      message: "Please enter all fields",
      success: false,
    });
  }

  try {
    // find user by username
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (!user) {
      return res.status(401).json({
        message: "Invalid Credentials",
        success: false,
      });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (checkPassword) {
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1h",
        }
      );
      // set cookie
      res.cookie(process.env.COOKIE_NAME as string, token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      return res.status(200).json({
        message: "Successfully logged in",
        success: true,
      });
    }

    return res.status(401).json({
      message: "Invalid Credentials",
      success: false,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
}

// Logout

export function UserLogOut(req: Request, res: Response) {
  res.clearCookie(process.env.COOKIE_NAME as string, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({
    message: "Logged out successfully",
    success: true,
  });
}

// Car rental booking

export async function UserBooking(req: Request, res: Response) {
  const userPayload = req.user as TokenPayload;
  if (!userPayload) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
    });
  }
  try {
    const { carName, days, rentPerDay }: UserBooking = req.body;
    if (
      !carName ||
      !days ||
      days < 1 ||
      days > 365 ||
      !rentPerDay ||
      rentPerDay < 0
    ) {
      return res.status(400).json({
        message: "Please send all details",
        success: false,
      });
    }
    const booking = await prisma.booking.create({
      data: {
        carName: carName,
        rentPerDay: rentPerDay,
        days: days,
        status: "BOOKED",
        userId: userPayload.id,
      },
    });
    const totalCost = rentPerDay * days;
    return res.status(201).json({
      success: true,
      data: {
        message: "Successfully created booking",
        bookingId: booking.id,
        totalCost: totalCost,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
}

// Cancel Booking

export async function CancelUserBooking(req: Request, res: Response) {
  const userPayload = req.user as TokenPayload;
  if (!userPayload) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
    });
  }
  const id = req.params.id;
  // check id is existing
  if (!id) {
    return res.status(404).json({
      message: "Booking not found",
      success: false,
    });
  }
  try {
    const updateBooking = await prisma.booking.updateMany({
      where: {
        id: Number(id),
        userId: userPayload.id,
        status: "BOOKED",
      },
      data: {
        status: "CANCELLED",
      },
    });
    if (updateBooking.count == 0) {
      return res.status(404).json({
        message: "Booking not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Booking cancelled",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
}

// Complete Booking

export async function CompleteUserBooking(req: Request, res: Response) {
  const userPayload = req.user as TokenPayload;
  if (!userPayload) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
    });
  }
  const id = req.params.id;
  // check id is existing
  if (!id) {
    return res.status(404).json({
      message: "Booking not found",
      success: false,
    });
  }
  try {
    const updateBooking = await prisma.booking.updateMany({
      where: {
        id: Number(id),
        userId: userPayload.id,
        status: "BOOKED",
      },
      data: {
        status: "COMPLETED",
      },
    });
    if (updateBooking.count == 0) {
      return res.status(404).json({
        message: "Booking not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Booking completed",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
}

// Delete Booking

export async function DeleteUserBooking(req: Request, res: Response) {
  const userPayload = req.user as TokenPayload;
  if (!userPayload) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
    });
  }
  const id = req.params.id;
  if (!id) {
    return res.status(404).json({
      message: "Booking not found",
      success: false,
    });
  }
  try {
    const deleteBooking = await prisma.booking.deleteMany({
      where: {
        id: Number(id),
        userId: userPayload.id,
      },
    });
    if (deleteBooking.count == 0) {
      return res.status(404).json({
        message: "Booking not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Booking deleted",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
}

// Get Booking
export async function GetUserBooking(req: Request, res: Response) {
  const userPayload = req.user as TokenPayload;
  if (!userPayload) {
    return res.status(401).json({
      message: "Unauthorized User",
      success: false,
    });
  }
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: Number(userPayload.id),
      },
    });
    if (bookings.length === 0) {
      return res.status(404).json({
        message: "No Bookings Found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Successfully fetched bookings",
      success: true,
      bookings: bookings,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
}
