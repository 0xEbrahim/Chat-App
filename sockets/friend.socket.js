const { sendFriendRequest } = require("../models/user.model");

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("sendFriendRequest", (data) => {
      sendFriendRequest(data)
        .then(() => {
          io.to(data.friendId).emit("newFriendRequest", {
            name: data.myName,
            id: data.myId,
          });
          socket.emit("RequestSent");
        })
        .catch((err) => {
          socket.emit("RequestFailed");
        });
    });
  });
};
