var express = require('express');
var router = express.Router();

require('../models/connection');
const Tweet = require('../models/tweets');

/* GET tweets listing. */
router.get('/', function (req, res, next) {
    Tweet.find().then(data => {
        if (data) {
            res.json({ result: true, data: data });
        } else {
            res.json({ result: false });
        }
    });
});

/* CREATE new tweet */
router.post('/new', function (req, res, next) {
    const newTweet = new Tweet({
        username: req.body.username,
        firstname: req.body.firstname,
        tweet: req.body.tweet,
        creationDate: req.body.date,
        like: 0
    });

    newTweet.save().then(newDoc => {
        res.json({ result: true, tweet: newDoc.tweet });
    });
});

/* UPDATE tweet */
router.put('/:id/like', function (req, res, next) {
    if (req.body.action === 'like') {
        Tweet.updateOne({ _id: req.params.id },  { $inc: { like: +1 }}).then(data => {
            if (data) {
                res.json({ result: true, data: data });
            } else {
                res.json({ result: false, error: 'Tweet non trouvé' });
            }
        });

    } else if(req.body.action === 'unlike'){
        Tweet.updateOne({ _id: req.params.id }, { $inc: { like: -1 }}).then(data => {
            if (data) {
                res.json({ result: true, data: data });
            } else {
                res.json({ result: false, error: 'Tweet non trouvé' });
            }
        });
    } else {
        res.json({ result: false, error: 'Action invalide' });
    }
});

/* DELETE tweet */
router.delete('/:id', function (req, res, next) {
    console.log(req.params.id)
    Tweet.deleteOne({ _id: req.params.id }).then(() => {
        Tweet.find().then(data => {
            if(data){
                res.json({ result: true, data: data });
            } else {
                res.json({ result: false, error : 'Tweet not found' });
            }
        });
       });
});

module.exports = router;