const Book = require('../models/Book');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError,BadRequestError } = require('../errors');


const getAllBooks = async (req, res) => {
    const books = await Book.find({ }).sort('createdAt');
    return res.status(StatusCodes.OK).json({
        books,
    });
}

const getSingleBook = async (req, res) => {
    const { id } = req.params;
    const book = await Book.findOne({ _id: id });
    if (!book) {
        throw new NotFoundError(`no such book with ${id}`);
    }
    return res.status(StatusCodes.OK).json(book);
}

const createSingleBook = async (req, res) => {
    req.body.createdBy = req.admin.adminId;
    const book = await Book.create({
        ...req.body
    })
    return res.status(StatusCodes.CREATED).json(book);
}

const updateSingleBook = async (req, res) => {
    const {
        id
    } = req.params;
    const {
        adminId
    } = req.admin;
    const {
        title,
        author,
        genre,
    } = req.body;
    const book = await Book.findOne({
        _id: id,
        createdBy: adminId
    });
    if (book) {
        if (title != undefined || author != undefined || genre != undefined) {
            const newBook = await Book.findOneAndUpdate({
                        _id: id,
                        createdBy: adminId
                    }, {
                ...req.body
            }, {
                new: true,
                runValidators: true
            });
            return res.status(StatusCodes.OK).json({
                book: newBook
            });
        } else {
            throw new BadRequestError('missing field(s)');
        }
    } else {
        throw new NotFoundError(`no book with such ${id}`);
    }
}

const deleteSingleBook = async (req, res) => {
    const {
        id
    } = req.params;
    const book = await Book.findOneAndDelete({
        _id: id
    });
    if (!book) {
       throw new NotFoundError(`no book with such ${id}`);
    }
    return res.status(StatusCodes.OK).json({
        book
    });
}

module.exports = {
    getAllBooks,
    getSingleBook,
    createSingleBook,
    updateSingleBook,
    deleteSingleBook,
}
