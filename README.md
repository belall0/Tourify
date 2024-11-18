# Tourify

## overview

Tourify is a RESTful API for managing tours, designed with scalability and flexibility in mind.

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

---

## Tech Stack

- **Architecture**: MVC
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose

---

## Installation

1- Clone the repository:

```bash
git clone
```

2- Navigate to the project directory:

```bash
cd tourify
```

3- Install the dependencies:

```bash
npm install
```

4- Create a `.env` file in the root directory and add the following environment variables:

```bash
NODE_ENV=development
PORT=3000
DATABASE_URL=<your_mongodb_uri>
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

---
