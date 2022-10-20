const express = require("express");
const userRoute = express.Router();

const orderDb = require('../model/orderModel');
const productDb = require("../model/productModel");
const controller = require("../controller/controller");
const otpcontroller = require("../controller/otpController");
// user signup
userRoute.get("/signup", (req, res) => {
    res.render("user/user_signup", { error: "" });
});


userRoute.post("/signup", controller.Create);



userRoute.get('/signupError', (req, res) => {
    const error = req.session.error;
    req.session.error = null;
    res.render('user/user_signup', { error });
})



module.exports = userRoute