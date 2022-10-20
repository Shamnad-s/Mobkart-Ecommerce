const express = require("express");
const route = express.Router();
const brandDb = require("../model/brandModel");
const offerDb = require("../model/offerModel");
const couponDb = require("../model/couponModel");
const productDb = require("../model/productModel");
const categoryDb = require("../model/categoryModel");
const controller = require("../controller/controller");
const dashController = require("../controller/dashController");
const objectId = require("mongoose").Types.ObjectId;
route.get("/", dashController.dash);
// admin home
route.post("/admin-home", controller.find);







module.exports = route