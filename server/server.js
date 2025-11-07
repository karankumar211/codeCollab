// all imports
require("dotenv").config();
const express = require("express");
const connectDB = require("./db/db");
const userRoutes = require("./routes/user.routes");
const cookieParser = require("cookie-parser");
const app = express();
const spaceRoutes = require("./routes/space.routes");
const snippetRoutes = require("./routes/snippet.routes");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // This is correct
    credentials: true,
  })
);

// connect to database
connectDB();

// routes

app.use("/api/user", userRoutes);
app.use("/api/spaces", spaceRoutes);
app.use("/api/snippets", snippetRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // --- FIX: Corrected typo "localhosst" to "localhost" ---
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join-snippet", (snippetId) => {
    socket.join(snippetId);
    console.log(`User ${socket.id} joined snippet room ${snippetId}`);
  });
  socket.on("code-change", (data) => {
    // --- ADDED THIS LOG (from previous step) ---
    console.log(`--- Code change from ${socket.id}: ${data.content}`);
    socket.to(data.snippetId).emit("receive-code-change", data.content);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// server listening
const Port = 5000;
server.listen(Port, () => {
  console.log(`Server is runing on port ${Port}`);
});