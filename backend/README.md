# Backend - CodeHert

This is the backend (API server) for CodeHert, an online judge platform for practicing Data Structures and Algorithms (DSA).

## Tech Stack
- Node.js
- Express
- MongoDB & Mongoose
- JWT (authentication)
- bcrypt (password hashing)
- Axios (HTTP requests to code runner)
- Gemini API (AI code review)

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in this directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```
- `PORT`: Port for the backend server (default: 5000)
- `MONGODB_URI`: MongoDB connection string (local or Atlas)
- `JWT_SECRET`: Secret key for JWT authentication
- `GEMINI_API_KEY`: API key for Gemini AI code review
- `NODE_ENV`: Set to `production` in production, `development` otherwise

### 3. Start the Server
```bash
npm start         # Start the server normally
npm run dev       # Start the server with nodemon (auto-restart on changes)
```
- The server will run on `http://localhost:5000` by default.
- Nodemon is included as a dependency, so you do not need to install it globally.

## Available Scripts
- `npm start` — Start the server
- `npm run dev` — Start the server with nodemon (auto-restart on changes, if configured)

## Project Structure
```
backend/
  ├── controllers/   # Route controllers
  ├── database/      # DB connection
  ├── middleware/    # Express middleware
  ├── models/        # Mongoose models
  ├── routes/        # API routes
  ├── index.js       # Entry point
  └── ...
```

## API Endpoints
- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`
- Problems: `/api/problems`, `/api/problems/:code`
- Submissions: `/api/submissions`, `/api/submissions/:id`
- AI Review: `/api/ai/codeReview`
- User: `/api/user/me`, `/api/user/:username`
- Admin: `/api/admin/problems`, `/api/admin/testcases`

## Notes
- The backend uses Axios to communicate with the code execution service (see `controllers/compileController.js`).
- Make sure MongoDB is running and accessible.
- The backend must be running for the frontend to work.
- For more details on the full project, see the main [README](../README.md). 