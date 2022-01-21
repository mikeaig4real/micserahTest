const mongoose = require('mongoose');
// {
//   "_id": {
//     "$oid": "61b583658083e1f6e352060e"
//   },
//   "pairID": "XDuxK2x8JVIH",
//   "createdAt": {
//     "$date": "2021-12-12T05:07:43.073Z"
//   },
//   "followID": "XDuxK2x8JVIH",
//   "followRound": 2,
//   "receiverID": "XDuxK2",
//   "senderID": "x8JVIH"
// }


const FollowerSchema = mongoose.Schema({
    pairID: {
        type: String,
        trim: true,
    },
    followID: {
        type: String,
        trim: true,
    },
    followRound: {
        type:Number,
    },
    receiverID: {
        type: String,
        trim: true,
    },
    senderID: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: String,
        trim: true,
    }
    }, {
    writeConcern: {
        w: 'majority',
        j: true,
        wtimeout: 1000
    },
});

module.exports = mongoose.model('Follower', FollowerSchema);
