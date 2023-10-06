require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const getRoutes = require("./routes/get");
const setRoutes = require("./routes/set");
//const userRoutes = require("./routes/user");

const app = express();

// CONNECT MONGODN
//console.log("process.env.DB_URL", process.env.DB_URL);
//console.log("process.env.DB_PW", process.env.DB_PW);
mongoose
  .connect(
    "mongodb+srv://PireSvyt:" + process.env.DB_PW + "@" + process.env.DB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(
    () => {},
    //console.log("Connexion à MongoDB réussie")
  )
  .catch((err) => {
    console.log("Connexion à MongoDB échouée");
    console.log(err);
  });

// CAPTURE REQ BODY
app.use(express.json());

// CORS MANAGEMENT
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// SERVER ENDPOINT
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/app.html"));
});

// ROUTES
app.use("/api/get", getRoutes);
app.use("/api/set", setRoutes);
//app.use("/api/user", userRoutes);

module.exports = app;
