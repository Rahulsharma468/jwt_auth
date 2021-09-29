const JWT = require('jsonwebtoken');
const USER = require('../model/userModel');

const requireAuth = (req,res,next) => {

    const TOKEN = req.cookies.jwt;
    if(TOKEN){
        JWT.verify(TOKEN , 'This is new Secrwet' , (err , decodedToken) => {
            if(err) res.redirect('/user/login');
            else {
                console.log(decodedToken);
                next();
            }
        })
    }else{
        res.redirect('/user/login');
    }
}

const currUser = (req,res,next) => {
    const TOKEN = req.cookies.jwt;
    if(TOKEN){
        JWT.verify(TOKEN , 'This is new Secrwet' , async(err , decodedToken) => {
            if(err){
                res.locals.user = null;
                 next();}
            else {
                // console.log(decodedToken);
                let curruser = await USER.findById(decodedToken.id);
                console.log(curruser)
                res.locals.user = curruser.email;
                next();
            }
        })
    }else{
        res.locals.user = null;
        next();
    }
}

module.exports = {requireAuth , currUser};