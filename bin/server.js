#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require("../app");
var debug = require("debug")("buzz-chat:server");
var http = require("http");

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "5000");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

// Socket.io Setup
const io = require("socket.io")(server);

var users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (userName) => {
    users[socket.id] = userName;
    socket.broadcast.emit("user-joined", userName);
  });

  // When send event is called recieve event is created for all users
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      userName: users[socket.id],
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("leave", users[socket.id]);
    delete users[socket.id];
  });
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => console.log(`server is listening on port ${port}`));
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
