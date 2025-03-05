const socket = io();
socket.on("connect", () => {
  const id = document.getElementById("myId").value;
  socket.emit("JoinNotificationRoom", id);
});
const btn = document.getElementById("friendRequestsDropdown");

socket.on("newFriendRequest", (data) => {
  const friendRequests = document.getElementById("friendRequests");
  const span = friendRequests.querySelector("span");
  if (span) span.remove();
  friendRequests.innerHTML += `
    <a class="dropdown-item" href="/profile/${data.id}">
     ${data.name}
    </a>
        `;
  btn.classList.remove("btn-primary");
  btn.classList.add("btn-danger");
});

btn.onclick = (e) => {
  e.preventDefault();
  btn.classList.remove("btn-danger");
  btn.classList.add("btn-primary");
};
