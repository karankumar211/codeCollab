# codeCollab 🚀

A collaborative real‑time code editor built with the MERN stack and Socket.io. Multiple developers can join a room and edit files simultaneously, with changes broadcast instantly.

---

## 📌 Overview
**codeCollab** removes the friction from pair‑programming by providing a shared editing environment. Behind the scenes it uses WebSockets for low‑latency synchronization and a Node/Express backend for user management and persistence.

### ✨ Key Features
- **Real‑Time Editing:** All participants see updates live.
- **Syntax Highlighting:** Ace Editor powers multi‑language support.
- **User Authentication:** JWT tokens, bcrypt hashing, and secure headers via helmet.
- **State Management:** Redux Toolkit governs frontend state.
- **Performance Tools:** Vite for frontend bundling; compression and morgan logging on the server.

### 🛠️ Tech Stack
| Component    | Technology                                    |
|--------------|-----------------------------------------------|
| Frontend     | React 18, Vite, Redux Toolkit, Axios, React-Ace |
| Backend      | Node.js, Express 5, Socket.io                 |
| Database     | MongoDB (Mongoose)                            |
| Security     | JWT, bcrypt, helmet, CORS, cookie-parser      |

---

## 🚀 Getting Started

Follow these steps to get the project running locally.

### 1. Prerequisites
- **Node.js** v18+ installed
- **MongoDB** (local or Atlas) running

### 2. Clone the repo
```bash
git clone https://github.com/karankumar211/codeCollab.git
cd codeCollab
```

### 3. Backend setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (see `.env.example` for required keys) with values such as:
   ```text
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/codecollab
   JWT_SECRET=your_secret_here
   ```
4. Start the server:
   ```bash
   npm run dev    # uses nodemon
   ```
5. The API will be available at `http://localhost:5000`.

### 4. Frontend setup
1. Open a new terminal and go to the `client` folder:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The frontend will open at `http://localhost:5173` (or another port shown in the terminal).

### 5. Usage
- Register a new user via the `/register` form.
- Create or join a room to begin editing.
- Share the room link with teammates to collaborate.

### 6. Running Tests
> *(Add instructions here if tests exist)*

### 7. Deployment
*Describe production build steps, environment variables, and any hosting notes.*

---

## 📁 Project Structure
```
client/            # React frontend (Vite)
server/            # Express backend
  controllers/
  models/
  routes/
  middlewares/
```

---

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request with a clear description of your changes.

---

## 📄 License
[MIT](LICENSE)
