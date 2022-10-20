const express = require("express");
const userRoute = express.Router();

const orderDb = require('../model/orderModel');
const productDb = require("../model/productModel");
const controller = require("../controller/controller");
const otpcontroller = require("../controller/otpController");
// user signup starts 
userRoute.get("/signup", (req, res) => {
    res.render("user/user_signup", { error: "" });
});

userRoute.post("/signup", controller.Create);



userRoute.get('/signupError', (req, res) => {
    const error = req.session.error;
    req.session.error = null;
    res.render('user/user_signup', { error });
})
// user signup starts 
// user login starts
userRoute.get("/login", (req, res) => {
    if (req.session.isUserLogin) {
        res.redirect('/')
    }
    res.status(200).render("user/user_login", { error: "" });
});
// log in with mobile number
userRoute.get("/loginotp", (req, res) => {
    if (req.session.isUserLogin) {
        res.redirect('/')
    }
    res.status(200).render("user/user_loginotp", { error: "" });
});
userRoute.post("/mobile", otpcontroller.mobileNum);


// OTP submit
userRoute.post("/otp", otpcontroller.otp);
userRoute.post('/resend', otpcontroller.resend)

module.exports = userRoute