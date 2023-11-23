import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import("./chat/chat/chat_nodejs/server.js");

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://finalproject:FINALmp111@backend.dkyjelj.mongodb.net/?retryWrites=true&w=majority",
    {
      dbName: "backend",
    }
  )
  .then(() => console.log("Database Connected"))
  .catch((e) => console.log(e));
  // defining schema of the data
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const adminSchema = new mongoose.Schema({
  secretkey: String,
  password: String,
});
var Message = mongoose.model("Message", {
  name: String,
  message: String,
});
// defining models for the schema
const User = mongoose.model("User", userSchema);
const admin = mongoose.model("admin", adminSchema);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Setting up View Engine
app.set("view engine", "ejs");
const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const decoded = jwt.verify(token, "sdjasdbajsdbjasd");

    req.user = await User.findById(decoded._id);

    next();
  } else {
    res.redirect("/login");
  }
};
// routes for handling http requests
app.get("/", isAuthenticated, (req, res) => {
  res.render("index");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/index", (req, res) => {
  res.render("index");
});
app.get("/thanks", (req, res) => {
  res.render("thanks");
});
app.get("/", (req, res) => {
  res.render("register");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/admin", (req, res) => {
  res.render("admin");
});
app.get("/index", (req, res) => {
  res.render("index");
});
app.get("/Courses", (req, res) => {
  res.render("Courses");
});
app.get("/Contact", (req, res) => {
  res.render("Contact");
});
app.get("/About", (req, res) => {
  res.render("About");
});
app.get("/Account", (req, res) => {
  res.render("Account");
});
app.get("/achievements", (req, res) => {
  res.render("achievements");
});
app.get("/messenger", (req, res) => {
  res.render("messenger");
});
app.get("/thread", (req, res) => {
  res.render("thread");
});
app.get("/readmore", (req, res) => {
  res.render("readmore");
});
app.get("/Curriculum", (req, res) => {
  res.render("Curriculum");
});
app.get("/1stYear", (req, res) => {
  res.render("1stYear");
});
app.get("/2ndYear", (req, res) => {
  res.render("2ndYear");
});
app.get("/3rdYear", (req, res) => {
  res.render("3rdYear");
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) return res.redirect("/register");
  const isMatch = bcrypt.compare(password, user.password, null);
  if (!isMatch)
    return res.render("login", { email, message: "Incorrect Password" });
  const token = jwt.sign({ _id: user._id }, "sdjasdbajsdbjasd");
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000000000000),
  });
  res.redirect("/index");
});

app.post("/admin", async (req, res) => {
  const { secretkey, password } = req.body;
  let Admin = await admin.findOne({ secretkey });
  if (!Admin) return res.redirect("/login");
  const isMatch = bcrypt.compare(password, secretkey, admin.password, null);
  if (!isMatch)
    return res.render("login", { email, message: "Incorrect Password" });
  const token = jwt.sign({ _id: admin._id }, "sdjasdbajsdbjasd");
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000000000000),
  });
  res.redirect("/index");
});

app.post("/admin", async (req, res) => {
  const { secretkey, password } = req.body;
  let user = await admin.findOne({ secretkey });
  if (user) {
    return res.redirect("/index");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  user = await User.create({
    secretkey,
    password: hashedPassword,
  });
  const token = jwt.sign({ _id: user._id }, "sdjasdbajsdbjasd");
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000000),
  });
  res.redirect("/index");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    return res.redirect("/login");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  const token = jwt.sign({ _id: user._id }, "sdjasdbajsdbjasd");
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/index");
});

app.get("/logout", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});
// creating server
app.listen(5000, () => {
  console.log("Server is working");
});
