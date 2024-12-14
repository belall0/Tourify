# Tourify

## Overview

Tourify is a RESTful API designed for multi-operator tour management. Operators can post and manage tours, while customers can browse and book tours. Designed with readability, maintainability, and scalability in mind.

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

### Authentication

| Method | Endpoint                         | Description            | Auth Required |
| ------ | -------------------------------- | ---------------------- | ------------- |
| POST   | /api/users/signup                | Create a new user      | No            |
| POST   | /api/users/login                 | Login an existing user | No            |
| POST   | /api/users/forgot-password       | Forgot password        | No            |
| POST   | /api/users/reset-password/:token | Reset password         | No            |
| PUT    | /api/users/update-password       | Update password        | Yes           |

### Profile Management

| Method | Endpoint      | Description         | Auth Required |
| ------ | ------------- | ------------------- | ------------- |
| GET    | /api/users/me | Get current user    | Yes           |
| PUT    | /api/users/me | Update current user | Yes           |
| DELETE | /api/users/me | Delete current user | Yes           |

---

### Tours

| Method | Endpoint       | Description             |
| ------ | -------------- | ----------------------- |
| POST   | /api/tours/    | Create a new tour       |
| GET    | /api/tours/    | Get all tours           |
| GET    | /api/tours/:id | Get a single tour by ID |
| PATCH  | /api/tours/:id | Update a tour by ID     |
| DELETE | /api/tours/:id | Delete a tour by ID     |

### Reviews

| Method | Endpoint               | Description                |
| ------ | ---------------------- | -------------------------- |
| POST   | /api/tours/:id/reviews | Create a review for a tour |
| GET    | /api/tours/:id/reviews | Get all reviews for a tour |

---

### Admin: Users

| Method | Endpoint      | Description             |
| ------ | ------------- | ----------------------- |
| GET    | api/users/    | Get all users           |
| POST   | api/users/    | Create a new user       |
| GET    | api/users/:id | Get a single user by ID |
| PATCH  | api/users/:id | Update a user by ID     |
| DELETE | api/users/:id | Delete a user by ID     |

### Admin: Reviews

| Method | Endpoint        | Description        |
| ------ | --------------- | ------------------ |
| POST   | api/reviews/    | Create a review    |
| GET    | api/reviews/    | Get all reviews    |
| GET    | api/reviews/:id | Get a review by ID |
| PATCH  | api/reviews/:id | Update a review    |
| DELETE | api/reviews/:id | Delete a review    |
