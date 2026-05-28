# CapstoneProject

## Overview

This repository contains the backend for a blog application built with Node.js, Express, MongoDB, and Mongoose. The backend supports user registration and login, author article management, admin user activation/blocking, and common authentication routes.

## Project Structure

- `blog-app-backend/`
  - `server.js` - Main Express server entrypoint that configures routes, middleware, and MongoDB connection.
  - `package.json` - Project dependencies and package metadata.
  - `req.http` - Example HTTP request collection for testing API endpoints.
  - `APIs/` - Route modules for common, user, author, and admin APIs.
  - `middlewares/` - Authentication and authorization middleware.
  - `models/` - Mongoose models for users and articles.
  - `services/` - Authentication service functions for registration and login.

## File Functionality

### `blog-app-backend/server.js`
- Creates the Express application and configures JSON parsing and cookie handling.
- Registers API routers for user, author, admin, and common routes.
- Connects to MongoDB using the `DB_URL` environment variable.
- Starts the server on the configured `PORT`.
- Includes basic 404 handling for invalid routes and centralized error handling.

### `blog-app-backend/package.json`
- Defines dependencies like `express`, `mongoose`, `bcrypt`, `jsonwebtoken`, and `cookie-parser`.
- Declares the module type as `module` to allow ES module syntax.

### `blog-app-backend/req.http`
- Contains sample HTTP requests for interacting with the backend API.
- Useful for manual testing with an HTTP client that supports `.http` files.

### `blog-app-backend/APIs/CommonAPI.js`
- Provides authentication routes used by all users.
- `POST /common-api/login` validates credentials and sets a JWT cookie.
- `GET /common-api/logout` clears the authentication cookie.
- `PUT /common-api/change-password` is intended to change the current user's password (requires a secured request and additional user lookup logic).

### `blog-app-backend/APIs/UserAPI.js`
- Handles public user routes.
- `POST /user-api/users` registers a new user with the role `USER`.
- `GET /user-api/articles` returns all articles.
- `GET /user-api/articles/:articleid` is a placeholder for comment or article-detail fetching logic.

### `blog-app-backend/APIs/AuthorAPI.js`
- Handles author-specific routes.
- `POST /author-api/users` registers a new user with the role `AUTHOR`.
- `POST /author-api/articles` creates a new article after validating the author.
- `GET /author-api/articles/:authorId` returns active articles created by a specific author.
- `PUT /author-api/articles/:articleid` updates an article if the authenticated author owns it.
- `DELETE /author-api/articles/author-id/:aid/article-id/:arid` performs a soft delete by marking an article inactive.

### `blog-app-backend/APIs/AdminAPI.js`
- Handles admin management routes.
- `DELETE /admin-api/users/:userid` blocks a user by marking `isActive` false.
- `GET /admin-api/users/:userid` unblocks a user by setting `isActive` true.
- Both admin routes require token verification.

### `blog-app-backend/models/ArticleModel.js`
- Defines the article schema with fields for author, title, category, content, comments, and active status.
- Includes a nested comment schema linking comments to user IDs.
- Uses timestamps and strict schema validation.

### `blog-app-backend/models/UserModel.js`
- Defines the user schema with fields for first name, last name, email, password, profile image URL, role, and active status.
- Enforces required fields and unique email constraint.
- Supports roles `AUTHOR`, `USER`, and `ADMIN`.

### `blog-app-backend/services/authServices.js`
- Implements user registration and authentication logic.
- `register(userObj)` validates a user, hashes the password, saves the user, and returns the user without the password.
- `authenticate({ email, password })` verifies email and password, checks account status, signs a JWT token, and returns the token plus user data.

### `blog-app-backend/middlewares/checkAuthor.js`
- Author authorization middleware.
- Confirms the request contains a valid author ID from `req.body.author` or `req.params.authorId`.
- Rejects requests when the user is missing, not an author, or not active.

### `blog-app-backend/middlewares/verifyToken.js`
- Token verification middleware.
- Reads the JWT token from `req.cookies.token`.
- Returns an unauthorized response if no token is present.
- Verifies the token using `JWT_SECRET` from environment variables.

## Setup Instructions

1. Copy `.env.example` to `.env` and set the following values:
   - `DB_URL` for MongoDB connection
   - `PORT` for server port
   - `JWT_SECRET` for JWT signing
2. Install dependencies:
   - `cd blog-app-backend`
   - `npm install`
3. Run the server:
   - `node server.js` or `npx nodemon server.js`

## Notes

- The project currently uses cookie-based JWT authentication.
- Some routes such as user article detail/comment retrieval are stubbed and may require additional implementation.
- Admin routes should eventually be restricted to admin users only.
