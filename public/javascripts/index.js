console.log("hello world");
const socket = io();
var userName;

const message_area = document.querySelector(".message_area");

do {
  userName = prompt("Enter Your Name:");
} while (!userName);

const appendJoined = (message, position) => {
  const message_center = document.createElement("div");
  message_center.classList.add(position);
  const joined = document.createElement("span");
  joined.classList.add("joined");
  joined.innerText = message;
  message_center.appendChild(joined);
  message_area.appendChild(message_center);
};

appendJoined("You joined the chat", "message-center");

const append = () => {
  const messageElement = document.getElementsByClassName();
};

socket.emit("new-user-joined", userName);

socket.on("user-joined", (userName) => {
  appendJoined(`${userName} joined the chat`, "message-center");
});
