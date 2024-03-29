const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
 firstname: String,
 username: String,
 tweet: String,
 creationDate: Date,
 like: Number,
 imgSrc: String,
 author: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
 likers : [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }]
});

const Tweet = mongoose.model('tweets', tweetSchema);

module.exports = Tweet;