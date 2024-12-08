# Tourify

## Overview

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
- CRUD functionalities for many resources.
- Advanced filtering, sorting, and pagination.
- Error handling with centralized error handling middleware.
- Authentication and Authorization

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
NODE_ENV=production
PORT=3000

DATABASE_URL=<your_mongodb_uri>

JWT_SECRET=<your_secret_key>
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

EMAIL_HOST=<your_email_host>
EMAIL_PORT=<your_email_port>
EMAIL_USERNAME=<your_email_username>
EMAIL_PASSWORD=<your_email_password>
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
| POST   | /api/tours/    | Create a new tour       |
| GET    | /api/tours/    | Get all tours           |
| GET    | /api/tours/:id | Get a single tour by ID |
| PATCH  | /api/tours/:id | Update a tour by ID     |
| DELETE | /api/tours/:id | Delete a tour by ID     |

### Users

| Method | Endpoint                         | Description            |
| ------ | -------------------------------- | ---------------------- |
| POST   | /api/users/signup                | Create a new user      |
| POST   | /api/users/login                 | Login an existing user |
| POST   | /api/users/forgot-password       | Forgot password        |
| POST   | /api/users/reset-password/:token | Reset password         |
| PATCH  | /api/users/update-password       | Update password        |
| PATCH  | /api/users/profile               | Update user details    |

---
