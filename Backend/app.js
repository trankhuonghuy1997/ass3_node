const http = require("http");
const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

// routes
const authRoute = require("./route/auth");
const shopRoute = require("./route/shop");
const adminRoute = require("./route/admin");

// files
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getMilliseconds() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// const accessLogStream = fs.createWriteStream("/tmp/access.log");

app.use(helmet());
app.use(compression());
// app.use(morgan("combined", { stream: accessLogStream }));

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).array("images")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// router
app.use(authRoute);
app.use(shopRoute);
app.use("/admin", adminRoute);

mongoose.set("strictQuery", true);

const server = http.createServer(app);

// connect MONGODB
mongoose
  .connect(
    "mongodb+srv://TranKhuongHuy:123456789%40@cluster0.wtxqxow.mongodb.net/asignment3_shop?retryWrites=true&w=majority"
  )
  .then((result) => {
    const serverIo = server.listen(process.env.PORT || 5000);
    const io = require("./socket").init(serverIo);
    io.on("connection", (socket) => {
      console.log("Connected");
    });
    console.log("Ok");
  })
  .catch((err) => console.log(err));

// module.exports = server;
