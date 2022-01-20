const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
    title: {
        required: [true, 'A title is needed'],
        type: String,
        trim: true,
    },
    author: {
        required: [true, 'A title is needed'],
        type: String,
        trim: true,
    },
    genre: {
        default: 'None',
        type:String,
    },
    createdBy: {
        required: [true, 'provide admin please'],
        type: mongoose.Types.ObjectId,
        ref: 'Admin',
    }
    }, {
        writeConcern: {
            w: 'majority',
            j: true,
            wtimeout: 1000
    },
    timestamps: true,
});

module.exports = mongoose.model('Book', BookSchema);
