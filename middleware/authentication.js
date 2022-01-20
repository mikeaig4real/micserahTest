const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const auth = async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer')) {
        throw new UnauthenticatedError('invalid token');
    }

    const token = header.split(' ')[1];
    try {
        const adminInfo = await jwt.verify(token, process.env.JWT_SECRET);
        const {
            adminId,
            adminName
        } = adminInfo;
        req.admin = { adminId, adminName };
        next();
    } catch (error) {
        throw new UnauthenticatedError('invalid token');
    }
}

module.exports = auth;
