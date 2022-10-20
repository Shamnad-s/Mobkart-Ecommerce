const bcrypt = require('bcrypt');
const Joi = require('joi');
const Userdb = require('../model/model');
const adminDb = require('../model/adminModel')
const ObjectId = require('mongoose').Types.ObjectId;


// User sign up
exports.Create = async (req, res) => {
    try {
        console.log(req.body);
        const USER = await Userdb.findOne({ $or: [{ email: req.body.email }, { number: req.body.number }] })
        if (USER) {
            req.session.error = "Account already in use"
            res.redirect('/signupError')
        }
        req.body.password = await bcrypt.hash(req.body.password, 10)
        const userObj = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            gender: req.body.gender,
            number: req.body.number
        }
        const user = new Userdb(userObj);
        const { error } = validate(userObj)
        if (error) {
            req.session.error = error?.details[0].message
            return res.status(200).redirect('/signupError')
        }
        user.save()
            .then(() => {
                res.status(201).redirect('/login')
            })
            .catch(err => {
                console.log(err);
                res.send("Error: " + err.message)
            })
    } catch (error) {
        console.log(error);
        res.status(400).send("Error Message: " + error.message)
    }
}
// User Login
exports.Find = async (req, res) => {
    if (req.session.isUserLogin) {
        res.redirect('/')
    } else {
        let userDb = await Userdb.findOne({ email: req.body.email })
        if (userDb) {
            if (userDb.isBlocked) {
                req.session.error = "Your account is blocked";
                res.redirect("/loginError")
            } else {
                req.session.user = userDb;
                const userId = req.session.user?._id
                bcrypt.compare(req.body.password, userDb.password).then((status) => {
                    if (status) {
                        req.session.isUserLogin = true;
                        res.redirect('/')
                    } else {
                        req.session.error = "Invalid Password";
                        res.redirect('/loginError')
                    }
                })
            }
        } else {
            req.session.error = "Invalid Username and Password";
            res.redirect('/loginError')
        }

    }
}


