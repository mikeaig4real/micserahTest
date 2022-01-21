const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { StatusCodes } = require('http-status-codes');
const { BadRequestError,UnauthenticatedError } = require('../errors');

const loginUser = async (req, res) => {
    const { user, password } = req.body;
    if (!user || !password) {
        throw new BadRequestError('Please provide complete login credentials');
    }
    let userName, emailAddress, phoneNumber
    let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let phoneNoRegex = /^[0-9]{6,14}$/
    if (emailRegex.test(user)) {
        emailAddress = user;
    } else if (phoneNoRegex.test(user)) {
        phoneNumber = user;
    } else {
        userName = user;
    }
    const userDb = await User.findOne({ $or: [{ userName }, { emailAddress }, { phoneNumber }] });
    if (!userDb) {
        throw new UnauthenticatedError('Invalid credentials');
    }
    const isCorrect = await bcrypt.compare(password, userDb.password);
    if (!isCorrect) {
        throw new UnauthenticatedError('password is incorrect,try again...');
    }
    const shortProfile = {
        UserId: userDb._id,
        UserIdF:userDb.userID,
        UserName: userDb.userName,
        UserFullName: userDb.fullName,
        UserPhone: userDb.phoneNumber,
        UserPicture: userDb.profilePic,
        UserEmail: userDb.emailAddress,
    }
    const token = jwt.sign({
        ...shortProfile
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFE
    });
    return res.status(StatusCodes.OK).json({ shortProfile, token });
}


module.exports = {
    loginUser,
}
