const express = require("express");
const Router = express.Router();
const { transactionController } = require("../controller");
const { tokenVerify } = require("../middleware/verifyToken");
const upload = require("../middleware/upload");

Router.get("/", tokenVerify, transactionController.getTransaction);
Router.get("/find", tokenVerify, transactionController.findTransaction);
Router.patch("/status/received", tokenVerify, transactionController.received);
Router.patch("/status/cancel", tokenVerify, transactionController.cancel);
Router.post("/add", tokenVerify, transactionController.addTransaction);
Router.get("/try", tokenVerify, transactionController.tryEventScheduler);
Router.post("/add", tokenVerify, transactionController.addTransaction);
Router.get("/invoice", tokenVerify, transactionController.getInvoice);
Router.post("/detail", tokenVerify, transactionController.getDetails);
Router.patch("/uploadPayment", upload, transactionController.uploadPayment);

module.exports = Router;
