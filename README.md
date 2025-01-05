# Tourify

## Overview

Tourify is a RESTful API designed for multi-operator tour management System. Operators can post and manage tours, while customers can browse, book, and review tours, Designed with readability, maintainability, and scalability in mind.

## Technologies Used

- **Architecture**: RESTful API, MVC
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT, Role-based Access Control
- **Email Service**: SendGrid
- **Testing**: Vitest, Supertest, Postman
- **Containerization**: Docker, Docker Compose, Docker Hub
- **Deployment**:MongoDB Atlas, Azure Virtual Machine
- **Image Storage**: Cloudinary
- **Server-sidr Rendering**: Pug, HTML, CSS, JavaScript, maptiler
- **Documentation**: Postman, Swagger

## Features

- **Authentication**: Users can signup, verify email, resend verification email, login, logout, and reset password.
- **Authorization**: Users are assigned roles (customer, operator, admin) and can only access routes that are permitted for their role.
- **RESTful API**: Well-defined endpoints for CRUD operations on tours, users, reviews, and bookings.
- **API Features**: Pagination, Filtering, Sorting, Field Limiting, and Aliasing.
- **Email Service**: Users receive welcome emails and password reset emails.
- **Image Upload**: Operators can upload images for their profile.

## Installation

Clone the repository

```bash
git clone
```

Navigate to the project directory

```bash
cd tourify
```

Create a .env file in the root directory and add the following environment variables

```bash
# APPLICATION
NODE_ENV=production
PORT=443

# AUTHENTICATION
JWT_SECRET=<YOUR_JWT_SECRET>
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# DATABASE
DB_USERNAME=<DB_USERNAME>
DB_PASSWORD=<DB_PASSWORD>
DB_URI=<DB_URI>

# EMAIL
SENDER_NAME=noreply
SENDER_EMAIL=<YOUR_EMAIL>
EMAIL_HOST=<YOUR_EMAIL_HOST>
EMAIL_PORT=<YOUR_EMAIL_PORT>
EMAIL_USERNAME=<YOUR_EMAIL_USERNAME>
EMAIL_PASSWORD=<YOUR_EMAIL_PASSWORD>

# CLOUDINARY
CLOUDINARY_CLOUD_NAME=<YOUR_CLOUD_NAME>
CLOUDINARY_API_KEY=<YOUR_CLOUDINARY_API_KEY>
CLOUDINARY_API_SECRET=<YOUR_CLOUDINARY_API_SECRET>
```

Build docker image and run the container

```bash
docker compose -f docker-compose.yml up -d --build
```

Visit <http://localhost:443/api-docs> in your browser
