const express = require("express");
const router = express.Router();
const { addFood, getFoods,updateFoods,deleteFoods } = require("../controllers/foodController");
router.post("/add", addFood);
router.get("/all", getFoods);
router.put("/update/:id",updateFoods);
router.delete("/delete/:id",deleteFoods);
module.exports = router;