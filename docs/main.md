# Tourify API Documentation

## Functional Requirements

### 1. Authentication

- User can sign up. => `POST /api/auth/signup`
- User can verify email after signing up. => `POST /api/auth/verify-email`
- User can resend the verification code to the email. => `POST /api/auth/resend-verification`
- User can log in. => `POST /api/auth/login`
- User can log out. => `POST /api/auth/logout`
- User can reset password. => `POST /api/auth/forgot-password` and `POST /api/auth/reset-password`

### 2. Profile

- User can view their profile. => `GET /api/users/me`
- User can update their profile. => `PUT /api/users/me`
- User can update their password. => `PUT /api/users/me/password`
- User can delete their account. => `DELETE /api/users/me`

### 3. Tour

- Operator can create a tour. => `POST /api/tours`
- Operator can update a tour. => `PUT /api/tours/:tourId`
- Operator can delete a tour. => `DELETE /api/tours/:tourId`
- Operator can get all his/her tours. => `GET /api/users/me/tours`
- User can view all tours. => `GET /api/tours`
- User can view a single tour. => `GET /api/tours/:tourId`

### 5. Booking

- User can book a tour. => `POST /api/tours/:tourId/bookings`
- User can update a booking such as the number of people. => `PUT /api/bookings/:bookingId`
- User can delete a booking. => `DELETE /api/bookings/:bookingId`
- User can view all bookings he/she made on all tours. => `GET /api/users/me/bookings`
- Operator can view all bookings of a specific tour. => `GET /api/tours/:tourId/bookings`

### 5. Review

- User can review a tour if he/she has booked the tour. => `POST /api/tours/:tourId/reviews`
- User can update a review of a tour. => `PUT /api/users/me/reviews/:reviewId`
- User can delete a review of a tour. => `DELETE /api/users/me/reviews/:reviewId`
- User can view all reviews of a specific tour. => `GET /api/tours/:tourId/reviews`
- User can view all reviews he/she made on all tours. => `GET /api/users/me/reviews`
