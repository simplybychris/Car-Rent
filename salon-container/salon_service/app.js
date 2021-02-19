const express = require("express"),
  app = express(),
  cors = require("cors"),
  bodyParser = require("body-parser");

require("mysql");
require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
// routers
const carsRouter = require("./routes/carsRoute");
const ordersRouter = require("./routes/ordersRoute");

// use router
app.use("/cars", carsRouter);
app.use("/orders", ordersRouter);

const port = process.env.PORT || 4010;
app.listen(port, () => console.log(`Server started, listening port: ${port}`));
