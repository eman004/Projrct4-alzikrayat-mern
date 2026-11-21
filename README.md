# Alzikrayat - MERN Edition

Full-Stack Photo Sharing Web Application built with **MongoDB, Express.js, React.js (Vite), and Node.js** following the 3-Tier Architecture and RESTful API design principles.

## Project Structure

```text
alzikrayat-mern/
├── server/          # Express.js REST API & Mongoose Models
└── client/          # React.js (Vite) Frontend SPA
```

## Prerequisites

- Node.js (v18+ recommended)
- MongoDB (Local instance or MongoDB Atlas URI)

## Setup & Running Locally

### 1. Backend Setup (`server/`)

```bash
cd server
npm install
```

Create a `.env` file inside `server/` (you can copy `server/.env.example`):

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/alzikrayat_mern
```

Start the backend server:

```bash
npm run dev
```

The API server runs on `http://localhost:3000`.

### 2. Frontend Setup (`client/`)

Open a new terminal window:

```bash
cd client
npm install
npm run dev
```

The React frontend runs on `http://localhost:5173`.

## Key API Endpoints

- `POST /api/auth/register` - Register a new user (hashes password with bcrypt)
- `POST /api/auth/login` - Authenticate user and return public profile
- `GET /api/photos` - Retrieve all photos with uploader details
- `GET /api/photos/:id` - Retrieve a single photo with its comments
- `POST /api/photos` - Upload a new photo (requires logged-in user)
- `DELETE /api/photos/:id` - Delete a photo (owner-only validation)
- `POST /api/photos/:id/comments` - Add a comment to a photo (requires logged-in user)
