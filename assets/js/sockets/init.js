const socket = io();
socket.on("connect", () => {
  const id = document.getElementById("myId").value;
  socket.emit("JoinNotificationRoom", id);
});
