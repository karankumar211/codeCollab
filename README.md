# codeCollab 🚀

A full-stack, real-time collaborative code editor that allows multiple users to code together in a shared environment. Built with the MERN stack and Socket.io for seamless, low-latency synchronization.

## 📌 Overview

**codeCollab** is designed to eliminate the friction of pair programming. It provides a synchronized editor where changes made by one user are instantly reflected for all other participants in the same room. By leveraging WebSockets and a robust backend, it ensures a smooth and interactive coding experience.

## ✨ Features

- **Real-Time Sync**: Multiple users can edit the same file simultaneously using WebSockets.
- **Room Management**: Join specific rooms to collaborate with specific people.
- **Multi-Language Support**: Integrated with **Ace Editor** for rich syntax highlighting.
- **State Management**: Powered by **Redux Toolkit** for predictable and scalable UI state.
- **Security**: 
  - JWT-based authentication for secure sessions.
  - Password hashing using `bcrypt`.
  - Secure HTTP headers via `helmet`.
- **Optimized Performance**: 
  - Backend compression and logging.
  - Blazing-fast frontend development and builds with **Vite**.

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Redux Toolkit, Axios, React-Ace |
| **Backend** | Node.js, Express.js (v5.x), Socket.io |
| **Database** | MongoDB (via Mongoose) |
| **Security** | JWT, Bcrypt, Helmet, CORS, Cookie-Parser |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (Atlas account or local instance)
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone [https://github.com/karankumar211/codeCollab.git](https://github.com/karankumar211/codeCollab.git)
cd codeCollab
