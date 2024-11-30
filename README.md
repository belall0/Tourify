# Tourify

## overview

Tourify is a RESTful API for managing tours, designed with readability, maintainability, and scalability in mind.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)

---

## Features

- RESTful architecture with well-defined endpoints ensuring seamless integration with any client.
- MVC architecture for easy maintenance and scalability.
- CRUD functionality for tours
- Advanced filtering, sorting, and pagination for tours.
  - Filtering by fields and ranges.
  - Sorting by single or multiple fields.
  - Pagination for handling large datasets.
  - Field inclusion/exclusion for optimized responses.
- Error handling with centralized error handling middleware.
  - Add error class for operational errors.
  - **catchAsync Utility**: Wraps async route handlers to catch and forward errors, eliminating repetitive `try...catch`
  - Differentiation between operational and programming errors.
  - Detailed error messages in development mode and generic messages in production mode.
  - Mongoose Error Handling: Custom error handling for many Mongoose errors.
- Authentication and Authorization
  - User signup and login.
  - JWT token generation and verification.
  - Protect routes with middleware.
  - Authorization based on user roles.
  - Password reset functionality
  - Password change functionality

---

## Tech Stack

- **Architecture**: MVC, RESTful
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT

---

## Installation

1- Clone the repository:

```bash
git clone
```

2- Navigate to the project directory:

```bash
cd Tourify
```

3- Install the dependencies:

```bash
npm install
```

4- Create a `.env` file in the root directory and add the following environment variables:

```bash
NODE_ENV=production/development
PORT=3000
DATABASE_URL=<your_mongodb_uri>
JWT_SECRET=<your_secret_key>
JWT_EXPIRES_IN=90d
```

5- Start the server:

```bash
npm run dev
```

API will be running on `http://localhost:3000`.

---

## API Endpoints

### Tours

| Method | Endpoint       | Description             |
| ------ | -------------- | ----------------------- |
| GET    | /api/tours     | Get all tours           |
| GET    | /api/tours/:id | Get a single tour by ID |
| POST   | /api/tours     | Create a new tour       |
| PATCH  | /api/tours/:id | Update a tour by ID     |
| DELETE | /api/tours/:id | Delete a tour by ID     |

### Users

| Method | Endpoint                   | Description            |
| ------ | -------------------------- | ---------------------- |
| POST   | /api/users/signup          | Create a new user      |
| POST   | /api/users/login           | Login an existing user |
| POST   | /api/users/forgot-password | Forgot password        |
| PATCH  | /api/users/reset-password  | Reset password         |
| PATCH  | /api/users/update-password | Update password        |

---
