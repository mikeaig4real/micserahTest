const Admin = require('../models/Admin');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError,UnauthenticatedError } = require('../errors');

const registerAdmin = async (req, res) => {
    const oldAdmin = await Admin.findOne({ username: req.body.username });
    if (!oldAdmin) {
        const admin = await Admin.create({
            ...req.body
        });
        const token = admin.getToken();
        return res.status(StatusCodes.CREATED).json({
            username: admin.username,
            token
        });
    };
    throw new BadRequestError(`Sorry ${oldUser.username} has been taken try new one please...`)
}

const loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        throw new BadRequestError('Please provide complete login credentials');
    }
    const admin = await Admin.findOne({ username });
    if (!admin) {
        throw new UnauthenticatedError('Invalid credentials');
    }
    const isCorrect = await admin.comparePwd(password);
    if (!isCorrect) {
        throw new UnauthenticatedError('password is incorrect,try again...');
    }
    const token = admin.getToken();
    return res.status(StatusCodes.OK).json({ username: admin.username, token });
}


module.exports = {
    registerAdmin,
    loginAdmin,
}
