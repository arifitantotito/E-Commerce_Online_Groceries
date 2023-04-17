const productController = require("./productController");
const userController = require("./userController");
const adminController = require("./adminController");
const cartController = require("./cartController");
const transactionController = require("./transactionController");
const discountController = require("./discountController");
const courierController = require("./courierController");
const thirdpartyController = require("./thirdpartyController")
const adminTransactionController = require("./adminTransactionController")

module.exports = {
	productController,
	userController,
	adminController,
	cartController,
	transactionController,
	discountController,
	courierController,
	thirdpartyController,
	adminTransactionController,
};
