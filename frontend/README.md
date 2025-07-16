# Frontend - CodeHert

This is the frontend (client) for CodeHert, an online judge platform for practicing Data Structures and Algorithms (DSA).

## Tech Stack
- React
- Redux Toolkit
- React Router
- Axios
- Vite

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
- The app will be available at `http://localhost:5173` by default (or as shown in your terminal).

### 3. Environment Variables
Create a `.env` file in this directory if you need to override defaults. Example:
```
VITE_API_BASE_URL=http://localhost:5000/api
```
- By default, the frontend expects the backend API at `http://localhost:5000/api`.

## Available Scripts
- `npm run dev` — Start the development server
- `npm run build` — Build the app for production
- `npm run preview` — Preview the production build locally

## Project Structure
```
frontend/
  ├── src/
  │   ├── api/         # API calls (Axios)
  │   ├── app/         # Redux store
  │   ├── components/  # React components
  │   ├── features/    # Redux slices
  │   ├── pages/       # Page components
  │   └── ...
  ├── index.html
  ├── package.json
  └── vite.config.js
```

## Notes
- Make sure the backend server is running for API requests to work.
- For more details on the full project, see the main [README](../README.md).
