require("dotenv").config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const fileUpload = require("express-fileupload");
const { v4: uuidv4 } = require("uuid");
// const hbs = require("express-handlebars");
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const session = require('express-session');
const app = express();
const port = 3000

// mongodb+srv://Amien:shamnad123@cluster0.gului2c.mongodb.net/?retryWrites=true&w=majority


mongoose.connect(`mongodb+srv://${process.env.MONGOURL}`,(err)=>{
    if(err){
        console.log("Could not connect to database");
        console.log(err)
    }else{
        console.log('Mongoose connected successfully');
    }
});

app.use(fileUpload());
// app.set('views', path.join(__dirname, 'views'));
// app.engine('hbs', hbs.engine({extname: 'hbs',defaultLayout: 'layout',layoutsDir:__dirname+'/views/layout/',usersDir:__dirname+'/views/user/'}));
app.set('view engine', 'ejs');
app.use(methodOverride("_method"));
app.use(express.static('public'));
app.use(morgan("tiny"));
// static files
app.use("/fonts", express.static(path.join(__dirname, "/public/assets/fonts")));
app.use("/icon", express.static(path.join(__dirname, "/public/assets/icon")));
app.use(
  "/images",
  express.static(path.join(__dirname, "/public/assets/images"))
);
app.use("/css", express.static(path.join(__dirname, "/public/css")));
app.use("/js", express.static(path.join(__dirname, "/public/js")));
app.use(
  "/productsImg",
  express.static(path.join(__dirname, "/public/productsImg")))
app.use(
  "/admin/productsImg",
  express.static(path.join(__dirname, "/public/productsImg"))
);  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.secret ,
    resave: false,
    saveUninitialized: true,
  })
);

app.use('/admin', require("./server/routes/router"));

app.use("/", require("./server/routes/userRouter"));

app.use(function(req, res, next) {
  
    next(createError(404));

  });
app.use(function(err, req, res, next) {
  
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
  });
app.use(function (req, res, next) {
    if (!req.user) {
      res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
      res.header("Expires", "-1");
      res.header("Pragma", "no-cache");
    }
    next();
  }); 
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  
  module.exports = app;
  

