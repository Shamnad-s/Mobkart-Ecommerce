const Userdb = require('../model/model');
const cartDb = require('../model/cartModel');
const bannerDb = require('../model/bannerModel')
const offerDb = require('../model/offerModel')
const productDb = require('../model/productModel')
const favDb = require('../model/favModel')
const ObjectId = require('mongoose').Types.ObjectId
var accountSid = process.env.TWILIO_ACCOUNT_SID || 'ACd070d6443029266aa9d26da9c6c47be3';
var authToken = process.env.TWILIO_AUTH_TOKEN || '28d6bc6a2a4339e57ec7a044f87fd8e0';
var serviceSid = process.env.TWILIO_SERVICE_SID || 'VAa9d1361a7e945af9f300c055b1e6194c';
const client = require("twilio")(accountSid, authToken);

exports.mobileNum = async (req, res) => {
    if (req.session.isUserLogin) {
        res.redirect('/')
    } else {
    const user = await Userdb.findOne({number:req.body.number})
    if (user){
        if (user.isBlocked){
            res.redirect('/blockedLogin')
        }else{
    client.verify
        .services(serviceSid)
        .verifications.create({
            to: `+91${req.body.number}`,
            channel: "sms"
        })
        .then(() => {
            res.status(200).render("user/user_login-otp",{error:false,number:req.body.number});
        });
    }
    }else{
        res.redirect('/notFound')
    }
}
}

exports.otp = async(req, res) => {
    if (req.session.isUserLogin) {
        res.redirect('/')
    } else {
    const otp = req.body.otp;
    client.verify
        .services(serviceSid)
        .verificationChecks.create({
            to: `+91${req.body.number}`,
            code: otp,
        })
        .then(async(resp) => {
            if (resp.valid) {
                const user = await Userdb.findOne({number:req.body.number})
                req.session.user = user;
                const userId = req.session.user?._id
                let cartCount = 0
                let cart = await cartDb.findOne({user:user._id})
                const banners = await bannerDb.find()
                if (cart) {
                    cartCount = cart.products.length
                }
                const offers = await offerDb.aggregate([
                    {
                        $lookup:{
                            from: 'productdbs',
                            localField:'proId',
                            foreignField:'_id',
                            as:'products'
                        }
                    },
                    {
                        $unwind:'$products'
                    },
                    {
                        $project:{
                            id:'$products._id',
                            price:'$products.Price',
                            products:'$products',
                            percentage:'$percentage',
                            offerPrice:{ $divide: [{$multiply: ['$products.Price','$percentage']},100 ]}
                        }
                    }
                ])
                const products = await productDb.find()
                const wishlist = await favDb.findOne({user:ObjectId(userId)})
                fav = wishlist?.products
                req.session.isUserLogin = true;
                res.redirect('/')
            }else{
                res.render('user/user_login-otp',{error:true,number:req.body.number});
            }
            
        });
    }
}

exports.resend = (req,res)=>{
        client.verify
            .services(serviceSid)
            .verifications.create({
                to: `+91${req.body.number}`,
                channel: "sms"
            })
            .then((resp) => {
                console.log("response ", resp);
                res.status(200).render("user/user_login-otp",{error:false,number:req.body.number});
            });
}