const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const cors = require("cors");
const dbconfig = require("./dbconfig.js");

// const url = require('./dbconfig.js');
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

// setup .env
dotenv.config();

//set view engine
app.set("view-engine", "ejs");

//Import routes
const authRoute = require("./routes/auth");
const workerRoute = require("./routes/workersRoute");
const carRoute = require("./routes/carsRoute");
const contentRoute = require("./routes/content");
const salonRoute = require("./routes/salonRoute");
const pageRoute = require("./routes/page");

//Connect to DB
mongoose.connect(
  process.env.DB_CONN,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => console.log("Connected to database.")
);

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:8081");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
//   res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
//   next();
// });
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
//   res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
//   next();
// });

app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:8081",
      "http://localhost:8082",
      "http://localhost:8085",
      "localhost:4030",
      "http://localhost:4030",
      "http://localhost:4040",
      "http://localhost:4050",
      process.env.BROWSER_URL,
    ],
  })
);

// app.use(
//   cors({
//     allowedHeaders: ["Content-Type"],
//     origin: "*",
//     preflightContinue: true,
//   })
// );

//Route Middlewares
app.use("/users", authRoute);
app.use("/workers", workerRoute);
app.use("/cars", carRoute);
app.use("/content", contentRoute);
app.use("/salons", salonRoute);
app.use("/", pageRoute);
const port = process.env.PORT || 3000;

app.listen(port, () => console.log("Server Up and running"));
