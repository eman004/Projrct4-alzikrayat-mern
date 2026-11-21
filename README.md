# Alzikrayat — MERN Photo Sharing Platform (Project 4 Bonus: Real-Time WebSockets)

**Alzikrayat** is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) photo-sharing web application built with a decoupled 3-Tier Architecture.

---

## Project 4 (Bonus) — Selected Track
* **Selected Track:** **Track D: Real-Time WebSocket (Socket.io)**
* **Rationale:** Enhances the commenting engine from Project 3 by enabling instant, bidirectional communication. When a user posts a comment on a photo, all other users currently viewing that same photo receive the comment immediately in real time without refreshing the page.

### Key Real-Time Features Implemented
* **Express + HTTP + Socket.io Integration:** Attached `Socket.io` to the Node.js HTTP server alongside Express REST endpoints.
* **Room-Based Broadcasting:** Users automatically join a dedicated photo room (`photo_<photoId>`) upon opening a photo detail page (`joinPhotoRoom`), ensuring real-time events (`newComment`) are broadcast strictly to viewers of that specific photo.
* **Client-Side Lifecycle & Deduplication:** Managed socket connections inside React's `useEffect` in `PhotoDetail.jsx`, deduplicating incoming comments by `_id` and cleanly leaving the room and disconnecting on component unmount (`leavePhotoRoom` & `socket.disconnect()`).

---

## Project Structure
```text
alzikrayat-mern/
├── client/                 # React + Vite Frontend (Port 5173)
│   ├── src/
│   │   ├── components/     # Navbar, CommentForm
│   │   ├── context/        # AuthContext (React Context + localStorage)
│   │   ├── pages/          # Home, Gallery, PhotoDetail (Socket.io client), LoginRegister
│   │   └── styles/         # Mobile-First responsive CSS
│   └── package.json
├── server/                 # Node.js + Express + Socket.io Backend (Port 3000)
│   ├── config/             # MongoDB connection
│   ├── controllers/        # authController, photoController, commentController (Socket emitter)
│   ├── middleware/         # Joi validation, Multer upload, errorHandler
│   ├── models/             # User, Photo, Comment Mongoose schemas
│   ├── routes/             # REST API routes
│   ├── uploads/            # Uploaded image storage
│   └── server.js           # Express + Socket.io server entry point
└── README.md