# CodeHert

An online judge platform for practicing Data Structures and Algorithms (DSA), featuring code submission, AI-powered code review, and user profiles.

## 🎥 Video Walkthrough

<video src="https://github.com/user-attachments/assets/620ec3e8-8143-4d0e-a7be-ef43d9304a1a" controls width="100%" />

*Complete platform demonstration showing the full user journey from registration to code submission and AI review*

## Features
- User registration and authentication
- Problem set and problem details
- Code submission and verdicts
- AI code review for submitted solutions
- Admin panel for managing problems and test cases
- User profiles and statistics

## Tech Stack
- **Frontend:** React, Redux Toolkit, React Router, Axios, Vite
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- **AI Integration:** Gemini API for code review
- **Other:** Docker (for code execution), RESTful API

## Project Structure
```
ONLINE_JUDGE_FINAL_PROJECT/
  ├── backend/      # Node.js/Express API server
  ├── frontend/     # React client app
  ├── compiler/     # Code execution engine (Dockerized)
  └── README.md     # Project overview (this file)
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or Atlas)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd ONLINE_JUDGE_FINAL_PROJECT
```

### 2. Setup Backend
```bash
cd backend
npm install
# Create a .env file (see backend/README.md for details)
npm start
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
# Create a .env file if needed (see frontend/README.md)
npm run dev
```

### 4. Setup Compiler (Optional, for local code execution)
```bash
cd ../compiler
npm install
# See compiler/README.md for Docker setup
```

## Environment Variables
- See `backend/README.md` and `frontend/README.md` for required environment variables and configuration.

## Useful Links
- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)
- [Compiler README](compiler/README.md)
