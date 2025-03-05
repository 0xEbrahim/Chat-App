const express = require("express");
const session = require("express-session");
const path = require("path");
require("dotenv").config();
const sessionStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const socketIO = require("socket.io");
const authRouter = require("./routes/auth.routes");
const profileRouter = require("./routes/profile.routes");
const friendRouter = require("./routes/friend.routes");
const { getFriendRequests } = require("./models/user.model");

const app = express();
const server = require("http").createServer(app);
const io = socketIO(server);
io.on("connection", (socket) => {
  console.log("New user connected");
  require("./sockets/init.socket")(socket);
});
app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "images")));
app.use(flash());

const STORE = new sessionStore({
  uri: process.env.DB_URL,
  collection: "sessions",
});

app.use(
  session({
    secret: "this is my secret secret to hash express sessions ......",
    saveUninitialized: false,
    store: STORE,
  })
);

app.set("view engine", "ejs");
app.set("views", "views");
app.use((req, res, next) => {
  let userId = req.session.userId;
  if (userId) {
    getFriendRequests(userId)
      .then((requests) => {
        req.friendRequests = requests;
        next();
      })
      .catch((err) => res.redirect("/error"));
  } else {
    next();
  }
});

app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/friend", friendRouter);
app.get("/error", (req, res, next) => {
  res.status(500);
  res.render("error.ejs", {
    isUser: req.session.userId,
    pageTitle: "Error",
    friendRequests: req.friendRequests,
  });
});

app.use((req, res, next) => {
  res.status(404);
  res.render("not-found", {
    isUser: req.session.userId,
    pageTitle: "Page Not Found",
    friendRequests: req.friendRequests,
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log("server listen on port " + port);
});
