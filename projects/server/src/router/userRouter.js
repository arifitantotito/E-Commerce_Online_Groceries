const express = require("express");
const { userController } = require("../controller");
const Router = express.Router();
const { tokenVerify } = require("../middleware/verifyToken");
const upload = require("../middleware/upload");

Router.get("/profile", tokenVerify, userController.getUser);
Router.get("/find-address", tokenVerify, userController.findAddress);
Router.post("/add-address", tokenVerify, userController.addAddress);
Router.patch("/editAddress", tokenVerify, userController.editAddress);
Router.get("/rakir-province", userController.rakirProvince);
Router.get("/rakir-city", userController.rakirCity);
Router.delete("/delete-address/:id", tokenVerify, userController.deleteAddress);
Router.patch("/main-address/:id", tokenVerify, userController.defaultAddress);
Router.patch(
	"/profile/picture",
	tokenVerify,
	upload,
	userController.editProfilePic
);
Router.patch(
	"/transaction/payment-proof",
	tokenVerify,
	upload,
	userController.editPaymentProof
);
Router.patch(
	"/profile/change-password",
	tokenVerify,
	userController.changePassword
);
Router.patch("/edit", tokenVerify, userController.updateUser);
Router.post("/register", userController.register);
Router.post("/login", userController.login);
Router.post("/keep-login", tokenVerify, userController.keepLogin);
Router.patch("/activation/:uid", userController.activation);
Router.patch("/reset-password/:uid", userController.resetPassword);
Router.post("/forgot-password", userController.forgotPassword);

module.exports = Router;
