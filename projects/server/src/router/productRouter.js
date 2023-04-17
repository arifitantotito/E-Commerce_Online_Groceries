const express = require("express");
const Router = express.Router();

const { productController } = require("../controller");
const { tokenVerify } = require("../middleware/verifyToken");

Router.get("/suggested", productController.getSuggested);
Router.get("/foryou", productController.getRandom);
Router.get("/totalPage", productController.totalPage);
Router.get("/category", productController.getCategory);
Router.get("/detail", productController.product_detail);
Router.get("/pageCategory", productController.totalPageCategory);
Router.get("/sortby", productController.sortby);
Router.get("/nearest", tokenVerify, productController.getNearestBranchProduct);
Router.patch("/updateStatus", productController.updateStatusProduct);

module.exports = Router;
