require("dotenv").config();
const express = require("express");
const db = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const path = require("path");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use(
  express.static(path.join(__dirname, "public"))
);
app.use(
  "/food_images",
  express.static(path.join(__dirname, "food_images"))
);
db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Database connected");
  }
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});