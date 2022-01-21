const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { UnauthenticatedError } = require('../errors');

const auth = async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer')) {
        throw new UnauthenticatedError('invalid token');
    }

    const token = header.split(' ')[1];
    try {
        const userInfo = jwt.verify(token, process.env.JWT_SECRET);
        const {
            UserId,
            UserIdF,
            UserName,
            UserFullName,
            UserPhone,
            UserPicture,
            UserEmail,
        } = userInfo;
        req.user = {
            UserId,
            UserIdF,
            UserName,
            UserFullName,
            UserPhone,
            UserPicture,
            UserEmail
        };
        next();
    } catch (error) {
        throw new UnauthenticatedError('invalid token');
    }
}

module.exports = auth;
