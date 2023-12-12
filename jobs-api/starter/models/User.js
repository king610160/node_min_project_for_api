const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true, 'Please provide name'],
        minlength: 3,
        maxlength: 50
    },
    email: {
        type:String,
        required:[true, 'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide valid email'
        ],
        unique: true
    },
    password: {
        type:String,
        required:[true, 'Please provide password'],
        minlength: 6
    },
})

// to let this code to function before save to database
UserSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// toJSON method is to delete password in user info
UserSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

// when use user schema, it will have method createdJWT
UserSchema.methods.createdJWT = function() {
    return jwt.sign({ userId: this._id, name: this.name}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
}

UserSchema.methods.compare = function(password) {
    // console.log(password)
    const result = bcrypt.compare(password, this.password)
    // console.log(result)
    return result
}



module.exports = mongoose.model('User', UserSchema)