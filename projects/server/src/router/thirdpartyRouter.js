const express = require("express");
const Router = express.Router();

const { thirdpartyController } = require("../controller");
Router.get("/forward", thirdpartyController.forward);
Router.get("/backward", thirdpartyController.backward);

module.exports = Router;
