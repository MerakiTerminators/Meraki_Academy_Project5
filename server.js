const express = require("express");
const cors = require("cors");
require("dotenv").config();
const socket = require("socket.io");
const db = require("./db/db");
const path = require("path");

//routers//
const registerRouter = require("./routers/routes/auth/signUp");
const loginRouter = require("./routers/routes/auth/login");
const favoriteRouter = require("./routers/routes/favorite");
const profileRouter = require("./routers/routes/profile");
const postRouter = require("./routers/routes/post");
const commentRouter = require("./routers/routes/comment");
const sportRouter = require("./routers/routes/sport");
const imageRouter = require("./routers/routes/Image");

const app = express();

//third-party middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.resolve(__dirname, "./client/build")));

//app routers
app.use(registerRouter);
app.use(loginRouter);
app.use(sportRouter);
app.use(favoriteRouter);
app.use(commentRouter);
app.use(imageRouter);
app.use(profileRouter);
app.use(postRouter);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server On ${PORT}`);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
});

io.on("connection", (socket) => {
  console.log("socket.id", socket.id);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log("user joined Room:", data);
  });

  socket.on("send_message", (data) => {
    console.log("data", data);
    socket.to(data.role).emit("receive_message", data.content);
  });

  socket.on("send_message_private", (data) => {
    console.log("data", data);
    socket.to(data.romeId).emit("receive_message_private", data.content);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
