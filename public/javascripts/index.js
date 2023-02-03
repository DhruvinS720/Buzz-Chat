const socket = io();
var userName;

const send_form = document.querySelector("#send_form");
const message_area = document.querySelector(".message_area");
const write_message = document.querySelector("#write_message");

do {
  userName = prompt("Enter Your Name:");
} while (!userName);

const scrollbottom = () => {
  message_area.scrollTop = message_area.scrollHeight;
};

send_form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user_message = { message: write_message.value, userName: "You" };
  append(user_message, "message-right");
  socket.emit("send", write_message.value);
  write_message.value = "";
});

const append = (data, position) => {
  console.log("halu");
  const div = document.createElement("div");
  div.classList.add(position);
  console.log(div);
  const h2 = document.createElement("h2");
  h2.classList.add("user");
  h2.innerText = data.userName;
  console.log(h2);
  const p = document.createElement("p");
  p.classList.add("message");
  p.innerText = data.message;
  console.log(p);
  div.appendChild(h2);
  div.appendChild(p);
  message_area.appendChild(div);
  scrollbottom();
};

const appendJoined = (message, position) => {
  const message_center = document.createElement("div");
  message_center.classList.add(position);
  const joined = document.createElement("span");
  joined.classList.add("joined");
  joined.innerText = message;
  message_center.appendChild(joined);
  message_area.appendChild(message_center);
  scrollbottom();
};

appendJoined("You joined the chat", "message-center");

socket.emit("new-user-joined", userName);

socket.on("user-joined", (userName) => {
  appendJoined(`${userName} joined the chat`, "message-center");
});

socket.on("receive", (data) => {
  append(data, "message-left");
});

socket.on("leave", (userName) => {
  if (userName != null) {
    appendJoined(`${userName} left the chat`, "message-center");
  }
});
