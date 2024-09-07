require("dotenv").config();
<<<<<<< HEAD
const express = require("express");
const app = express();

const serviceConnectMongoDB = require("./src/database/serviceDatabaseConnect.js");
const authRoutes = require("./src/routes/auth.js");
const userRoutes = require("./src/routes/user.js");
const transactionRoutes = require("./src/routes/transaction.js");
const categoryRoutes = require("./src/routes/category.js");
const tagRoutes = require("./src/routes/tag.js");
const computeRoutes = require("./src/routes/compute.js");
const shelfRoutes = require("./src/routes/shelf.js");
const shoppingRoutes = require("./src/routes/shopping.js");
=======
const http = require("http");
const app = require("./src/app");

// NORMALIZE PORT
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
var portVal = "";
switch (process.env.ENV) {
  case "dev":
    portVal = "3000";
    break;
  case "prod":
    portVal = "8080";
    break;
  default:
    portVal = "3002";
}
const port = normalizePort(process.env.PORT || portVal);
app.set("port", port);
//console.log("port", port);
>>>>>>> 378a68d12edd6ed961b42febd2d1ffc0527c34fd

// CONNECT MONGO
serviceConnectMongoDB();

// CAPTURE REQ BODY
app.use(express.json());

// CORS MANAGEMENT
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.SUPPORTED_ORIGIN);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Max-Age", "3600");
  next();
});

// ROUTES
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/transaction", transactionRoutes);
app.use("/category", categoryRoutes);
app.use("/tag", tagRoutes);
app.use("/compute", computeRoutes);
app.use("/shelf", shelfRoutes);
app.use("/shopping", shoppingRoutes);

// Landing
app.get("/", (req, res) => {
  res.send("<h1>reCP© back end</h1>");
});

module.exports = app;
