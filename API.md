# CodeHert API Documentation

This document provides an overview of the main REST API endpoints for the CodeHert Online Judge platform.

## Authentication

### POST /api/auth/register
- Register a new user.
- Body: `{ username, email, password }`
- Response: User object or error

### POST /api/auth/login
- Log in a user.
- Body: `{ email, password }`
- Response: JWT token and user info

## Problems

### GET /api/problems
- Get a list of all problems.
- Query params: `difficulty`, `tags` (optional)
- Response: Array of problems

### GET /api/problems/:id
- Get details of a specific problem.
- Response: Problem object

### POST /api/problems (Admin)
- Create a new problem.
- Auth: Admin required
- Body: Problem data
- Response: Created problem

### PUT /api/problems/:id (Admin)
- Update a problem.
- Auth: Admin required
- Body: Updated problem data
- Response: Updated problem

### DELETE /api/problems/:id (Admin)
- Delete a problem.
- Auth: Admin required
- Response: Success message

## Submissions

### POST /api/submissions
- Submit code for a problem.
- Body: `{ problemId, code, language }`
- Response: Submission result and verdict

### GET /api/submissions?userId=&problemId=
- Get submissions by user/problem.
- Response: Array of submissions

## AI Code Review

### POST /api/ai/review
- Get AI feedback on submitted code.
- Body: `{ code, language }`
- Response: AI review/comments

## Users

### GET /api/users/:id
- Get user profile and stats.
- Response: User object

### PUT /api/users/:id
- Update user profile.
- Auth: User required
- Body: Profile data
- Response: Updated user

## Admin/Test Cases

### POST /api/admin/testcases
- Add test cases to a problem.
- Auth: Admin required
- Body: Test case data
- Response: Created test case

### PUT /api/admin/testcases/:id
- Update a test case.
- Auth: Admin required
- Body: Updated test case data
- Response: Updated test case

### DELETE /api/admin/testcases/:id
- Delete a test case.
- Auth: Admin required
- Response: Success message

---

For more details, see the backend code and controller files.
