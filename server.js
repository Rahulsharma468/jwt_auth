const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const session = require('express-session');
const HBS = require('express-handlebars');
// const cors = require('cors');
// const favicon = require('serve-favicon');
const path = require('path');
// const morgan = require('morgan');
const mongoose = require('mongoose');
const DATABSE = process.env.DATABASE || 'mongodb+srv://tanjiro:konnoyaro55066@cluster0.z7p3x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const AUTH = require('./controller/helper');
const USER = require('./routes/userRoutes');

const APP = express();

//Mongoose Connection
mongoose.connect(DATABSE , {useNewUrlParser: true , useUnifiedTopology:true} , (err) => {
    if(err) console.log(err.message);
    console.log("Connected");
})

//Connection Setups
APP.use(bodyParser.urlencoded({extended : true}));
APP.use(bodyParser.json());
APP.use(cookieParser());
APP.use(express.json());
// APP.use(morgan('dev'));
// APP.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//HandleBars Setup
APP.engine("handlebars", HBS());
APP.set("view engine", "handlebars");

//Public Folder Setup
APP.get('*' , AUTH.currUser);
APP.use(express.static("public"));
APP.use('/user' , USER);

APP.get('/' , AUTH.requireAuth , (req,res) => {
    res.render('pages/splash')
})

// APP.get('/set_cookies' ,(req,res) => {
//   // res.setHeader('Set-Cookies' , 'newUser=true');
//   res.cookie('newUser' , false , { maxAge: 1000*60*60*24 , httpOnly: true});
//   res.send("Got Cookie");
// })

// APP.get('/get_cookies' , (req,res) => {
//   const cookies = req.cookies;
//   console.log(cookies);
//   res.json(cookies.newUser);
// })

APP.listen(3000 , () => {
    console.log("App is on 8000");
})
