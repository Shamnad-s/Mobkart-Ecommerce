const express = require("express");
const userRoute = express.Router();
const orderDb = require('../model/orderModel');
const productDb = require("../model/productModel");
const cartcontroller = require('../controller/CartController');
const couponController = require('../controller/couponController');
const favController = require("../controller/favController");
const controller = require("../controller/controller");
const savedController = require("../controller/savedController");
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

userRoute.post('/place-order/:price', orderController.orderPlacing)

userRoute.post('/verify-payment', orderController.paymentVerification)
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
// Coupon 
userRoute.post("/applycoupon/:coupon/:total", couponController.applyCoupon)
//  Favorites 
userRoute.post("/add-to-fav:id", favController.fav)

userRoute.get('/user-fav', favController.find)

userRoute.post("/remove-product-fav", favController.removeProfav)
// OTP page 
userRoute.post("/mobile", otpcontroller.mobileNum);

userRoute.get("/blockedLogin", (req, res) => {
    res.render('user/user_loginotp', { error: "Your account is blocked" })
})
userRoute.get('/notFound', (req, res) => {
    res.render('user/user_loginotp', { error: "This Number is not registered" })
})


// OTP submit
userRoute.post("/otp", otpcontroller.otp);
userRoute.post('/resend', otpcontroller.resend)
//  Profile 
userRoute.get('/user-profile', async (req, res) => {
    const user = req.session.user
    res.render('user/profile', { user, error: "", passworderror: "" })
})
userRoute.post('/profile-edit', controller.profileEdit)

userRoute.get('/profileError', (req, res) => {
    const user = req.session.user
    const error = req.session.error;
    req.session.error = null;
    res.render('user/profile', { user, error, passworderror: "" });
})
// Buy Now
userRoute.get('/buy-now', orderController.buynowPage)

userRoute.post('/save-address', savedController.saveAddress)

userRoute.post('/buyplace-order/:price/:proId', orderController.buynow)
// User Home
userRoute.post("/home", controller.Find);
//Password Change 
userRoute.post('/password-change', controller.passwordChange)
userRoute.get('/pswdChangeErr', (req, res) => {
    const user = req.session.user;
    const passworderror = req.session.passwordError;
    res.render('user/profile', { user, error: "", passworderror });
})

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
//Orders 
userRoute.get('/user-orders', orderController.Find)

userRoute.get('/cancel/:id', orderController.cancel)

userRoute.get('/productDetail', productController.productDetails)
//  Order Placed
userRoute.get('/order-success', async (req, res) => {
    const address = req.session.address;
    const proId = req.session.products;
    console.log("req.session.orderDate", req.session.orderDate);
    const order = await orderDb.findOne({ date: req.session.orderDate })
    await orderDb.updateOne({ date: req.session.orderDate }, { $set: { status: 'Ordered' } })
    const products = await productDb.find({ _id: { $in: proId } })
    res.render('user/order_success', { user: req.session.user, address, cartItems: products })
})
module.exports = userRoute