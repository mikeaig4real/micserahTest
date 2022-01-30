const User = require('../models/User');
const Follower = require('../models/Follower');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors');

// always make promises to favour the event loop
const returnSuggestions = (UserIdF,notSentFollow, usersNotUser, allFollowers) => {
    return new Promise((resolve, reject) => {
        try {
            let suggestionsUsers = [];
            notSentFollow.map((follower) => {
                let inSuggestionSender = suggestionsUsers.find(user => user.userID == follower.senderID);
                let inSuggestionReceiver = suggestionsUsers.find(user => user.userID == follower.receiverID);
                if (!inSuggestionSender) {
                    suggestionsUsers.push(usersNotUser.find(user => user.userID == follower.senderID))
                }
                if (!inSuggestionReceiver) {
                    if (follower.receiverID !== UserIdF) {
                        suggestionsUsers.push(usersNotUser.find(user => user.userID == follower.receiverID));
                    }
                }
            });
            suggestionsUsers = suggestionsUsers.map(({ userID, phoneNumber, userName, emailAddress }) => {
                let followerCount = allFollowers.filter(follower => follower.receiverID == userID).length;
                return { userID, phoneNumber, userName, emailAddress, followerCount }
            }).sort((a, b) => b.followerCount - a.followerCount);
            resolve(suggestionsUsers);
        } catch (error) {
            reject(error);
        }
    })
}

const getSuggestions = async (req, res) => {
    const { UserId, UserIdF } = req.user;
    const allFollowers = await Follower.find({});
    const usersNotUser = await User.find({ userID: { $ne: UserIdF } });
    const notSentFollow = await Follower.find({ $and: [{ followRound: 1 }, { senderID: { $ne: UserIdF } }] });
    const suggestionsUsers = await returnSuggestions(UserIdF,notSentFollow, usersNotUser, allFollowers);
    return res.status(StatusCodes.OK).json(suggestionsUsers);
}

module.exports = {
    getSuggestions,
}
