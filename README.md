Car Rental Booking API – Backend Assignment

A production-style backend service for a car rental booking platform built with Node.js, Express, TypeScript, Prisma, PostgreSQL and JWT authentication.

This system supports user authentication, secure session management using HTTP-only cookies, and full lifecycle management of rental bookings.

Features
Authentication

User signup with bcrypt password hashing

User login with JWT token stored in HTTP-only cookies

Secure logout

JWT middleware using res.locals for request-scoped user context

Booking Management

Create rental bookings

Cancel bookings (only if status = BOOKED)

Complete bookings (only if status = BOOKED)

Delete bookings

Ownership enforcement – users can only modify their own bookings

State transition enforcement using Prisma filters

Security

JWT authentication middleware

HTTP-only cookies

Booking ownership validation at database level

Input validation & edge-case handling

Tech Stack
Layer Technology
Runtime Node.js
Framework Express
Language TypeScript
ORM Prisma
Database PostgreSQL (NeonDB)
Auth JWT + Cookies
Hashing bcrypt
Folder Structure
src/
├── controllers/
│ └── userController.ts
├── lib/
│ ├── prismaClient.ts
│ └── bcrypt.ts
├── middleware/
│ └── verifyJWT.ts
├── routes/
│ └── userRoutes.ts
├── types/
│ └── authType.ts
└── index.ts
prisma/
└── schema.prisma

Environment Variables

Create a .env file in root:

DATABASE_URL=your_postgres_url
JWT_SECRET=your_jwt_secret
COOKIE_NAME=auth_token
NODE_ENV=development

Setup Instructions

1. Install dependencies
   npm install

2. Initialize Prisma
   npx prisma generate
   npx prisma migrate dev --name init

3. Run Development Server
   npm run dev

API Endpoints
Auth
Method Route Description
POST /signup Register user
POST /login Login user
POST /logout Logout user
Booking
Method Route Description
POST /booking Create booking
PATCH /booking/:id/cancel Cancel booking
PATCH /booking/:id/complete Complete booking
DELETE /booking/:id Delete booking

All booking routes require authentication.

Booking State Rules
Current Status Allowed Transition
BOOKED CANCELLED / COMPLETED
CANCELLED ❌
COMPLETED ✅

Enforced directly at database layer.

Key Design Decisions

JWT decoded once in middleware and attached to res.locals

No DB user fetch per request — trust signed JWT payload

State enforcement using Prisma conditional updates

Stateless authentication

Clean separation of controllers, middleware, and lib utilities

Production Readiness

No sensitive data returned

Secure cookie handling

Ownership protection

Strict validation

No broken state transitions
