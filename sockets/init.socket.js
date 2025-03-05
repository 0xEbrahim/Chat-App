module.exports = (socket) => {
  socket.on("JoinNotificationRoom", (data) => {
    socket.join(data);
    console.log("Socket joined the room: ", data);
  });
};
