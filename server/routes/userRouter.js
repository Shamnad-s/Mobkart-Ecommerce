const express = require("express");
const userRoute = express.Router();
const cartcontroller = require('../controller/CartController');
const orderDb = require('../model/orderModel');
const productDb = require("../model/productModel");
const controller = require("../controller/controller");
const orderController = require('../controller/orderController');
const otpcontroller = require("../controller/otpController");
const productController = require('../controller/productController');
// user landing
userRoute.get("/", controller.landing);
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
// user signup ends 
// user login starts
userRoute.get("/login", (req, res) => {
    if (req.session.isUserLogin) {
        res.redirect('/')
    }
    res.status(200).render("user/user_login", { error: "" });
});
// Cart
userRoute.get('/cart', cartcontroller.userCart)

userRoute.post("/change-product-quantity", cartcontroller.changeProductQuantity)

userRoute.post("/remove-product-cart", cartcontroller.removeProcart)

userRoute.get('/place-order', orderController.myOrders)

// userRoute.post('/place-order/:price', orderController.orderPlacing)

// userRoute.post('/verify-payment', orderController.paymentVerification)
// log in with mobile number
userRoute.get("/loginotp", (req, res) => {
    if (req.session.isUserLogin) {
        res.redirect('/')
    }
    res.status(200).render("user/user_loginotp", { error: "" });
});
userRoute.post("/mobile", otpcontroller.mobileNum);
// Add to cart
userRoute.get("/add-to-cart:id", cartcontroller.addToCart)


// OTP submit
userRoute.post("/otp", otpcontroller.otp);
userRoute.post('/resend', otpcontroller.resend)
// User Home
userRoute.post("/home", controller.Find);

userRoute.get('/loginError', (req, res) => {
    const error = req.session.error;
    req.session.error = null;
    res.render('user/user_login', { error });
})
userRoute.get("/logout_user", (req, res) => {
    req.session.user = null;
    req.session.isUserLogin = false;
    res.redirect('/')
});

userRoute.get('/productDetail', productController.productDetails)
module.exports = userRoute