const express = require("express");
const { cartController } = require("../controller");
const { tokenVerify } = require("../middleware/verifyToken");
const Router = express.Router();

Router.post("/add", tokenVerify, cartController.addToCart);
Router.get("/get", tokenVerify, cartController.getCart)
Router.post("/inc",cartController.incrementQuantity)
Router.post("/dec",cartController.decrementQuantity)
Router.delete("/del",cartController.deleteCart)

module.exports = Router;
