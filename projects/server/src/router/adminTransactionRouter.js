const express = require('express')
const {adminTransactionController} = require('../controller')
const Router = express.Router()
const { tokenVerify } = require('../middleware/verifyToken')

Router.get("/get", tokenVerify, adminTransactionController.getTransaction)
Router.patch("/cancel", adminTransactionController.cancelTransaction)
Router.patch("/process", adminTransactionController.processOrder)
Router.patch("/sent", adminTransactionController.sendOrder)
Router.post("/details", tokenVerify,adminTransactionController.getDetail)

module.exports = Router