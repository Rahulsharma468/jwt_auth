const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const USER = new mongoose.Schema({
    email:{
        type: String , 
        required: [true , "Please Enter An Email"] ,
        unique: true , 
        lowercase: true,
        validate: [ isEmail , "Please Enter A Valid Email"]
    },
    password:{
        type: String,
        required: [true , "Please Enter A Password"],
        minlength: [6 , "Minimum Password Length Is 6 Characters"]
    }
})

USER.pre('save' , async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password , salt);
    next();
});

USER.statics.login = async function(email , password) {
    const currUser = await this.findOne({email: email});
    if(currUser){
       const auth = await bcrypt.compare(password , currUser.password);
       if(auth){
           return currUser;
       }
       throw Error('incorrect Password!');
    }
    throw Error('incorrect email');
};

module.exports = mongoose.model('user' , USER);