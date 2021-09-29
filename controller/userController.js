const USER = require('../model/userModel');
const JWT = require('jsonwebtoken');
const AUTH = require('./helper');

const handleErrors = (err)=> {
    // console.log(err.message , err.code);
    let ERRORS = {email: '' , password: ''};

    //duplicate email error
    if(err.code === 11000){
        ERRORS.email = "This Email Is Already Registered";
        return ERRORS;
    }

    //incorrent email
    if(err.message === 'incorrect email'){
        ERRORS.email = 'This Email Is Not Registered';
    }

    //incorrect password
    if(err.message === 'incorrect Password!'){
        ERRORS.password = 'Incorrect Password!';
    }

    //validate errors
    /*
    properties:{
        validator: [Function (anonymous)],
        message: 'Please Enter An Email',
        type: 'required',
        path: 'email',
        value: ''
    }
    */
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            ERRORS[properties.path] = properties.message
        });
    }

    return ERRORS;
}

const MAX_AGE = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return JWT.sign({id} , 'This is new Secrwet' , { expiresIn: MAX_AGE })
}

const LoginController = async (req,res) => {
    const {email,password} = req.body;

    try{
        const currUser = await USER.login(email , password);
        const TOKEN = createToken(currUser._id);
        res.cookie('jwt', TOKEN, { httpOnly: true, maxAge: MAX_AGE * 1000 });
        res.status(200).json({ user: currUser._id });
    }catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }

}

const RegisterController = async(req,res) => {
    const { email,password } = req.body;
    try{
        const newUser = await USER.create({ email , password });
        const TOKEN = createToken(newUser._id);
        res.cookie('jwt', TOKEN, { httpOnly: true, maxAge: MAX_AGE * 1000 });
        res.status(201).json({user: newUser._id});
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

const logoutController = (req,res) => {
    res.cookie('jwt' , '' , {maxAge: 1});
    res.redirect('/');
}

module.exports = {
    LoginController,
    RegisterController,
    logoutController
}