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

### Authentication: All Users

| Method | Endpoint                         | Description            | Auth Required | Permissions |
| ------ | -------------------------------- | ---------------------- | ------------- | ----------- |
| POST   | /api/users/signup                | Create a new user      | No            | None        |
| POST   | /api/users/login                 | Login an existing user | No            | None        |
| POST   | /api/users/forgot-password       | Forgot password        | No            | None        |
| POST   | /api/users/reset-password/:token | Reset password         | No            | None        |
| PUT    | /api/users/update-password       | Update password        | Yes           | None        |

### Profile : All Users

| Method | Endpoint      | Description         | Auth Required | Permissions |
| ------ | ------------- | ------------------- | ------------- | ----------- |
| GET    | /api/users/me | Get current user    | Yes           | None        |
| PUT    | /api/users/me | Update current user | Yes           | None        |
| DELETE | /api/users/me | Delete current user | Yes           | None        |

### Profile : Admin

| Method | Endpoint       | Description       | Auth Required | Permissions |
| ------ | -------------- | ----------------- | ------------- | ----------- |
| GET    | /api/users     | Get all users     | Yes           | Admin       |
| GET    | /api/users/:id | Get a single user | Yes           | Admin       |
| DELETE | /api/users/:id | Delete a user     | Yes           | Admin       |

---

### Tour : All users

| Method | Endpoint       | Description       | Auth Required | Permissions |
| ------ | -------------- | ----------------- | ------------- | ----------- |
| GET    | /api/tours     | Get all tours     | No            | None        |
| GET    | /api/tours/:id | Get a single tour | No            | None        |

### Tour : Operators

| Method | Endpoint      | Description       | Auth Required | Permissions     |
| ------ | ------------- | ----------------- | ------------- | --------------- |
| POST   | /api/tours    | Create a new tour | Yes           | Operator        |
| PUT    | /api/tours:id | Update a tour     | Yes           | Operator        |
| DELETE | /api/tours:id | Delete a tour     | Yes           | Operator, Admin |
