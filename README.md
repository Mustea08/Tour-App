# Natours API

A RESTful API built with **Node.js**, **Express**, and **MongoDB / Mongoose** for managing tours, bookings, and users.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Recent Updates & Enhancements](#recent-updates--enhancements)
- [API Endpoints](#api-endpoints)
  - [Tours](#tours)
  - [Users](#users)
- [Error Handling Strategy](#error-handling-strategy)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Scripts](#scripts)

---

## Overview

The Natours API is a comprehensive backend application demonstrating modern RESTful design patterns, robust Mongoose data modeling, schema validations, aggregation pipelines, and production-grade error handling.

---

## Tech Stack

- **Runtime:** Node.js (>= 18.0.0)
- **Framework:** Express 4.x
- **Database & ODM:** MongoDB, Mongoose 5.x
- **Logging & Utilities:** Morgan, Slugify, Validator.js, Dotenv
- **Code Quality:** ESLint (Airbnb base configuration), Prettier

---

## Project Architecture

The project follows the standard **MVC (Model-View-Controller)** pattern:

```text
Tour/
├── controllers/
│   ├── errorController.js       # Global error handler middleware
│   ├── tourController.js        # Handlers for tour routes & aggregations
│   └── userController.js        # Handlers for user management
├── dev-data/
│   └── data/                    # Sample tour data and import/dev scripts
├── models/
│   └── tourModel.js             # Mongoose schema, validation & middleware
├── public/                      # Static assets
├── routes/
│   ├── tourRoutes.js            # Express router for tour endpoints
│   └── userRoutes.js            # Express router for user endpoints
├── utils/
│   ├── apiFeatures.js           # Query filtering, sorting, field limiting & pagination
│   ├── appError.js              # Operational error class extending built-in Error
│   └── catchAsync.js            # Wrapper to eliminate repetitive try-catch blocks
├── app.js                       # Express app configuration & middleware pipeline
├── server.js                    # Server startup, database connection & process safety
├── config.env                   # Local environment configuration
└── package.json                 # Dependencies and npm scripts
```

---

## Recent Updates & Enhancements

### 1. Centralized Global Error Handling
- **Operational Errors (`AppError`):** Created a custom `AppError` class inheriting from `Error` marking errors as operational with custom HTTP status codes and statuses (`fail` or `error`).
- **Async Catch Utility (`catchAsync`):** Wrapped controller handler functions in a higher-order utility that forwards rejected promises to Express's `next(err)`.
- **Global Error Handler (`errorController.js`):**
  - **Development Mode:** Detailed error output including stack trace, error object, and error details.
  - **Production Mode:** Distinguishes operational errors from programming/unknown bugs to avoid leaking sensitive stack traces.
  - **Mongoose Error Handlers:** Catches and translates `CastError` (invalid MongoDB ObjectIDs), duplicate key errors (code `11000`), and `ValidationError`.
- **Process Exception Safeguards (`server.js`):**
  - Handled `uncaughtException` to exit gracefully.
  - Handled `unhandledRejection` to close the server and exit the process safely.

### 2. Advanced Querying (`APIFeatures`)
Replaced inline query building with a reusable `APIFeatures` class supporting:
- **Filtering:** Supports MongoDB query operators (`gte`, `gt`, `lte`, `lt`) automatically prepended with `$`.
- **Sorting:** Multi-field sorting via comma-separated query parameters (`?sort=price,-ratingsAverage`), defaulting to newest first (`-createdAt`).
- **Field Limiting (Projection):** Selective fields via comma-separated strings (`?fields=name,duration,price`), stripping internal fields (`-__v`).
- **Pagination:** Offset-based pagination with `page` and `limit` parameters (`?page=2&limit=10`).

### 3. Aggregations & Analytics
- **`top-5-cheap` Alias Route:** Pre-configures request queries using middleware (`limit=5`, `sort=-ratingsAverage,price`).
- **Tour Statistics (`/tour-stats`):** Aggregation pipeline grouping tours by difficulty to compute average ratings, number of ratings, average price, min/max price.
- **Monthly Plan (`/monthly-plan/:year`):** Aggregation pipeline unwinding tour start dates to summarize busy months and tour schedules.

### 4. Advanced Mongoose Middleware & Schema Validation
- Custom validators (e.g., verifying `priceDiscount` is strictly less than `price`).
- `validator.js` integration for alphanumeric checks.
- Document middleware (`pre('save')` slug generation using `slugify`).
- Query middleware (`pre(/^find/)` excluding secret tours by default).
- Aggregation middleware (`pre('aggregate')` prepending `$match` to exclude secret tours).

---

## API Endpoints

Base URL: `http://localhost:3000/api/v1`

### Tours

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/tours` | Get all tours (supports filter, sort, fields, pagination) |
| `POST` | `/tours` | Create a new tour |
| `GET` | `/tours/:id` | Get single tour by ID |
| `PATCH` | `/tours/:id` | Update tour fields by ID |
| `DELETE` | `/tours/:id` | Delete tour by ID |
| `GET` | `/tours/top-5-cheap` | Alias route returning top 5 cheapest, highest-rated tours |
| `GET` | `/tours/tour-stats` | Tour statistics grouped by difficulty |
| `GET` | `/tours/monthly-plan/:year` | Monthly tour start planning for a given year |

### Users

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/users` | Get all users |
| `POST` | `/users` | Create user |
| `GET` | `/users/:id` | Get user by ID |
| `PATCH` | `/users/:id` | Update user by ID |
| `DELETE` | `/users/:id` | Delete user by ID |

---

## Error Handling Strategy

1. **404 Unhandled Routes:** Any route not matching registered routers triggers a 404 `AppError` caught by `app.all('*')`.
2. **Operational Errors:** Handled explicitly with meaningful messages and status codes.
3. **Database Errors in Production:** Mongoose-specific errors are converted into operational errors before sending responses to clients.

---

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- MongoDB instance (local or MongoDB Atlas cluster)

### Installation
```bash
git clone <repository-url>
cd Tour
npm install
```

### Environment Variables
Configure your environment variables in `config.env`:

```env
NODE_ENV=development
PORT=3000
DATABASE=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/natours?retryWrites=true&w=majority
PASSWORD=your_database_password
```

### Running the App

- **Development mode (with auto-reload):**
  ```bash
  npm start
  ```

- **Production mode:**
  ```bash
  npm run start:prod
  ```

- **Debug mode (Node inspector):**
  ```bash
  npm run debug
  ```

---

## Scripts

| Command | Description |
|---|---|
| `npm start` | Starts application using `nodemon` in development mode |
| `npm run start:prod` | Runs application with `NODE_ENV=production` |
| `npm run debug` | Starts application with Node inspector (`--inspect`) |
