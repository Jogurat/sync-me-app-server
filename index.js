const express = require("express");
const { default: ShortUniqueId } = require("short-unique-id");
const app = express();
var cors = require("cors");

app.use(cors());
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const uid = new ShortUniqueId();

server.listen(process.env.PORT || 3000, () => {
  console.log("Server listening");
});

app.get("/newRoom", (req, res) => {
  console.log("hi");
  let id = uid();
  console.log("sent id: ", id);
  res.json({ uid: id });
});

io.on("connection", (socket) => {
  // do stuff with the socket here;
  console.log("connected", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} joined room ${roomId}`);
    socket.broadcast.to(roomId).emit("newUser", socket.id);
  });

  socket.on("play", (roomId) => {
    socket.to(roomId).emit("play");
    console.log(`emitting play on room ${roomId}`);
  });

  socket.on("pause", (roomId) => {
    socket.to(roomId).emit("pause");
    console.log(`emitting pause on room ${roomId}`);
  });

  socket.on("seek", (obj) => {
    socket.broadcast.to(obj.roomId).emit("seek", obj.currentTime);
  });
});
