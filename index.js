require("dotenv").config();
const express = require("express");
const app = express();

const serviceConnectMongoDB = require("./src/database/serviceDatabaseConnect.js");

const authRoutes = require("./src/routes/auth.js");
const settingRoutes = require("./src/routes/setting.js");
const adminRoutes = require("./src/routes/admin.js");
const gdprRoutes = require("./src/routes/gdpr.js");
const userRoutes = require("./src/routes/user.js");
const communityRoutes = require("./src/routes/community.js");
const tagRoutes = require("./src/routes/tag.js");

const transactionRoutes = require("./src/routes/transaction.js");
const coefficientRoutes = require("./src/routes/coefficient.js");
const categoryRoutes = require("./src/routes/category.js");
const budgetRoutes = require("./src/routes/budget.js");

const shelfRoutes = require("./src/routes/shelf.js");
const shoppingRoutes = require("./src/routes/shopping.js");
const shoppingpriceRoutes = require("./src/routes/shoppingprice.js");
const shopRoutes = require("./src/routes/shop.js");

const actionRoutes = require("./src/routes/action.js");
const recurrenceRoutes = require("./src/routes/recurrence.js");

const trashRoutes = require("./src/routes/trash.js");

const recipeRoutes = require("./src/routes/recipe.js");

const craftRoutes = require("./src/routes/craft.js");
const skillRoutes = require("./src/routes/skill.js");
const rewardRoutes = require("./src/routes/reward.js");

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
app.use("/setting", settingRoutes);
app.use("/admin", adminRoutes);
app.use("/gdpr", gdprRoutes);
app.use("/user", userRoutes);
app.use("/community", communityRoutes);
app.use("/tag", tagRoutes);

app.use("/transaction", transactionRoutes);
app.use("/coefficient", coefficientRoutes);
app.use("/category", categoryRoutes);
app.use("/budget", budgetRoutes);

app.use("/shelf", shelfRoutes);
app.use("/shopping", shoppingRoutes);
app.use("/shoppingprice", shoppingpriceRoutes);
app.use("/shop", shopRoutes);

app.use("/action", actionRoutes);
app.use("/recurrence", recurrenceRoutes);

app.use("/trash", trashRoutes);

app.use("/recipe", recipeRoutes);

app.use("/craft", craftRoutes);
app.use("/skill", skillRoutes);
app.use("/reward", rewardRoutes);

// Landing
app.get("/", (req, res) => {
  res.send("<h1>Easy communities©</h1>");
});

module.exports = app;
