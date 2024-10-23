require("dotenv").config();
const express = require("express");
const app = express();

const serviceConnectMongoDB = require("./src/database/serviceDatabaseConnect.js");
const authRoutes = require("./src/routes/auth.js");
const adminRoutes = require("./src/routes/admin.js");
const gdprRoutes = require("./src/routes/gdpr.js");
const userRoutes = require("./src/routes/user.js");
const communityRoutes = require("./src/routes/community.js");
const transactionRoutes = require("./src/routes/transaction.js");
const coefficientRoutes = require("./src/routes/coefficient.js");
const categoryRoutes = require("./src/routes/category.js");
const tagRoutes = require("./src/routes/tag.js");
const shelfRoutes = require("./src/routes/shelf.js");
const shoppingRoutes = require("./src/routes/shopping.js");
const shopRoutes = require("./src/routes/shop.js");
const actionRoutes = require("./src/routes/action.js");
const recurrenceRoutes = require("./src/routes/recurrence.js");
const trashRoutes = require("./src/routes/trash.js");


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
app.use("/admin", adminRoutes);
app.use("/gdpr", gdprRoutes);
app.use("/user", userRoutes);
app.use("/community", communityRoutes);
app.use("/transaction", transactionRoutes);
app.use("/coefficient", coefficientRoutes);
app.use("/category", categoryRoutes);
app.use("/tag", tagRoutes);
app.use("/shelf", shelfRoutes);
app.use("/shopping", shoppingRoutes);
app.use("/shop", shopRoutes);
app.use("/action", actionRoutes);
app.use("/recurrence", recurrenceRoutes);
app.use("/trash", trashRoutes);

// Landing
app.get("/", (req, res) => {
  res.send("<h1>Easy communities©</h1>");
});

module.exports = app;