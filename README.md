# 🧩 Real-Time Collaborative Logic Puzzle Platform

A full-stack real-time collaborative puzzle game where multiple users can join the same room and solve a logic puzzle together.  
Built with **Spring Boot + WebSockets (STOMP)** on the backend and **React (Vite) + Redux Toolkit** on the frontend, with real-time synchronization across clients.

---

## 🚀 Live Demo

- **Live URL**: https://puzzle-game-seven-phi.vercel.app/ 

---

## ✨ Features

- 🔁 **Real-time collaboration** using WebSockets (STOMP over SockJS)
- 👥 Multiple users can join the same room
- 🧠 Shared puzzle state synchronized across all clients
- 🚫 Server-side validation to prevent invalid moves
- 🔄 Automatic WebSocket reconnection handling
- 🌐 REST APIs for room and puzzle management
- ⚡ Fast frontend built with Vite + Tailwind
- 🗂️ Clean architecture (Controller → Service → Repository)

---

## 🏗️ Tech Stack

### Frontend
- React (Vite)
- Redux Toolkit
- Tailwind CSS
- Axios
- SockJS + STOMP

### Backend
- Spring Boot
- Spring WebSocket (STOMP)
- Spring Data JPA
- H2 Database (in-memory)
- Maven
- Docker (Java 21)

### Deployment
- Frontend: **Vercel**
- Backend: **Render (Dockerized)**

---

## 📐 High-Level Architecture
```
Browser A ─┐
├── WebSocket (STOMP) ──► Spring Boot ──► Shared Puzzle State
Browser B ─┘

Browser ── REST APIs ──► Room & Puzzle Initialization
```


---

## 🔁 Real-Time Flow

1. User creates or joins a room
2. Frontend fetches initial puzzle state via REST
3. WebSocket connection established to `/ws`
4. User actions are sent to `/app/move`
5. Backend validates move and broadcasts updates to `/topic/room/{roomId}`
6. All connected clients receive updates instantly

---

## 🧩 Backend API Endpoints

### Create Room
```
POST /api/rooms?name={roomName}
```
### Get Puzzle State
```
GET /api/puzzle/{roomId}
```
### WebSocket Endpoints
```
/ws -> WebSocket handshake
/app/move -> Send puzzle moves
/topic/room/{roomId} -> Subscribe to room updates
```

---

## 🧠 Server-Side Validation & Concurrency

- Invalid moves are rejected at the backend
- Duplicate or conflicting updates are ignored
- Only valid state changes are broadcast
- Prevents race conditions between users

---

## 🔄 WebSocket Reconnection Strategy

- SockJS fallback enabled
- Automatic reconnect on refresh or temporary disconnect
- State is re-fetched on reconnect to ensure consistency

---


## 🗂️ Project Structure (Backend)
```
backend/
├── src/main/java/com/example/demo
│ ├── controller
│ ├── service
│ ├── model
│ ├── repo
│ └── config
├── Dockerfile
├── pom.xml
└── application-prod.properties
```

## 🗂️ Project Structure (Frontend)
```
frontend/
├── src
│ ├── components
│ ├── pages
│ ├── store (Redux Toolkit)
│ ├── services (API + WebSocket)
│ └── App.jsx
├── tailwind.config.js
├── vercel.json
└── vite.config.js
```

## ⚙️ Environment Variables

### Frontend (Vercel)
```
VITE_API_URL=https://<backend-url>
```
### Backend (Render)
```
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=prod
```
---

## 🐳 Docker (Backend)

The backend is containerized using **Java 21**.

### Build & Run Locally
```bash
docker build -t puzzle-backend .
docker run -p 8080:8080 puzzle-backend
```

## 🧪 How to Test Real-Time Sync
- Open the app in two different browsers
- Join the same room
- Make a move in one browser
- Verify instant update in the other browser
- Refresh page → state persists and syncs correctly

## 🛠️ Local Development
```
Backend

cd backend
./mvnw spring-boot:run
Runs at:
http://localhost:8080

Frontend

cd frontend
npm install
npm run dev
Runs at:
http://localhost:5173
```

## 🧠 Key Engineering Highlights
- Correct real-time synchronization without race conditions
- Robust server-side validation and concurrency handling
- Clean WebSocket integration with fallback and reconnection
- Production-ready CORS and HTTPS-safe WebSocket setup
- Scalable architecture suitable for multiplayer extensions

## 📌 Future Enhancements
- Persistent database (PostgreSQL / MongoDB)
- Authentication & user presence indicators
- Chat within rooms
- Puzzle difficulty levels
- Leaderboards








