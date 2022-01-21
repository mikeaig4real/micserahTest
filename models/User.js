const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const UserSchema = mongoose.Schema({
    userID: {
        type: String,
        trim: true,
    },
    countryCode: {
        type: String,
        trim: true,
    },
    dob:{
        type: String,
        trim: true,
    },
    emailAddress: {
        type: String,
        trim: true,
    },
    emailverify: Boolean,
    fullName: {
        type: String,
        trim: true,
    },
    gender:{
        type: String,
        trim: true,
    },
    password: {
        type: String,
        trim: true,
    },
    phoneNumber: {
        type: String,
        trim: true,
    },
    profilePic: {
        type: String,
        trim: true,
    },
    registerDate:{
        type: String,
        trim: true,
    },
    registerType: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        trim: true,
    },
    subscription: {
        type: String,
        trim: true,
    },
    userName:{
        type: String,
        trim: true,
    },
    wallet: Number,
    deviceOS: {
        type: String,
        trim: true,
    },
    deviceToken: {
        type: String,
        trim: true,
    },
    loginType: {
        type: String,
        trim: true,
    },
},
    {
    writeConcern: {
        w: 'majority',
        j: true,
        wtimeout: 1000
    },
})


UserSchema.methods.getToken = function () {
    return jwt.sign({
        UserId: this._id,
        UserName: this.userName,
        UserFullName: this.fullName,
        UserPhone: this.phoneNumber,
        UserPicture: this.profilePic,
        UserEmail: this.emailAddress,
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFE
    });
}

UserSchema.methods.comparePwd = async function (pwd) {
    const correct = await bcrypt.compare(pwd, this.password);
    return correct;
}

module.exports = mongoose.model('User', UserSchema);
