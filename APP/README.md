# CodeSync - Real-Time Collaborative Code Editor

**CodeSync** is a powerful online collaborative code editor designed and built by [@chayanmallick13](https://github.com/chayanmallick13). This project enables multiple developers to collaborate in real-time using Monaco Editor and WebSockets, offering granular user roles and secure room-based sharing via join codes.

---

## ✨ Features

- 🔐 **Room-Based Access with Join Codes**  
  Securely create and join collaborative rooms using unique join codes.

- 🧑‍💻 **Real-Time Code Collaboration**  
  Multiple users can edit the same code simultaneously using Yjs + Monaco.

- 👑 **Role-Based Permissions**  
  Each user can be assigned roles like:
  - **Owner**: Full control over the room and members
  - **Moderator**: Can assist in managing users
  - **Writer**: Can edit code
  - **Reader**: View-only access

- 🎨 **Customizable Preferences**  
  Change themes, font sizes, and choose ligature-supported fonts (like Fira Code, JetBrains Mono, etc.)

- 🟢 **Live Active Status**  
  Real-time display of users currently active in a room.

- 💬 **Chat Integration**  
  Built-in chat for room communication (extendable).

---

## 🧰 Tech Stack

- **Frontend:** React, Redux Toolkit, Tailwind CSS, Monaco Editor  
- **Backend:** Node.js, Express, MongoDB, Mongoose  
- **WebSocket:** Socket.IO, Yjs, y-websocket  
- **Authentication:** JWT-based authentication

---

## 🛠️ Installation Instructions

### ✅ Prerequisites

- Node.js (v18 or above)
- MongoDB (local or Atlas)
- A modern web browser (Chrome/Edge/Firefox)

---

### 🔧 Clone the Repository

```bash
git clone https://github.com/chayanmallick13/CodeSync.git
cd CodeSync
