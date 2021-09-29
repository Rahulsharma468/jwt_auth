const { Router } = require('express');
const express = require('express');
const route = express.Router();

const { LoginController , RegisterController , logoutController } = require('../controller/userController');

route.get('/login' , (req,res) => {
    res.render('pages/login');
});
route.post('/login' , LoginController);
route.get('/register' , (req,res) => {
    res.render('pages/register')
});
route.post('/register' , RegisterController);

route.get('/dashboard' , (req,res) => {
    res.render('pages/splash');
})
route.get('/logout' , logoutController);

module.exports = route;