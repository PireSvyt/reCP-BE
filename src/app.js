import config from "./config";
import ReactDOM from "react-dom";

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ingredientRoutes = require("./routes/ingredient");
const recipeRoutes = require("./routes/recipe");
//const userRoutes = require("./routes/user");
const transactionRoutes = require("./routes/transaction");
const balanceRoutes = require("./routes/balance");
const thisweekRoutes = require("./routes/thisweek");

const app = express();

// CONNECT MONGODN
const pw = "PireSvytPW";
mongoose
  .connect(
    "mongodb+srv://PireSvyt:" +
      pw +
      "@recpclustertrial.qmxbn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log("Connexion à MongoDB réussie"))
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
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// SERVER ENDPOINT
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/app.html"));
});

// ROUTES
app.use("/api/ingredient", ingredientRoutes);
app.use("/api/recipe", recipeRoutes);
//app.use("/api/user", userRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/balance", balanceRoutes);
app.use("/api/thisweek", thisweekRoutes);

module.exports = app;

if (config.env === "DEV") {
  const rootElement = document.getElementById("status");
  ReactDOM.render(<h2>DEV MODE</h2>, rootElement);
}
