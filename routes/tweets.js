var express = require('express');
var router = express.Router();

require('../models/connection');
const Tweet = require('../models/tweets');
const User = require('../models/users');

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
        like: 0,
    });

    newTweet.save().then(newDoc => {
        res.json({ result: true, tweet: newDoc.tweet });
    });
});

/* UPDATE tweet */
router.put('/:id/like', function (req, res, next) {
    let userID
    User.findOne({ token : req.body.token }).then(data => {
        if(data){
            // On récupère l'ObjectID de l'utilisateur qui a appuyé sur le coeur
            userID = data._id;
            // Selon si l'utilisateur a liké ou unliké
            if (req.body.action === 'like') {
                Tweet.updateOne({ _id: req.params.id },  { $inc: { like: +1 },$push: { likers: userID } }).then(data => {
                    if (data) {
                        res.json({ result: true, data: data, userID: userID});
                    } else {
                        res.json({ result: false, error: 'Tweet non trouvé' });
                    }
                });
        
            } else if(req.body.action === 'unlike'){
                Tweet.updateOne({ _id: req.params.id }, { $inc: { like: -1 }, $pull: { likers: userID }}).then(data => {
                    if (data) {
                        res.json({ result: true, data: data, userID: userID });
                    } else {
                        res.json({ result: false, error: 'Tweet non trouvé' });
                    }
                });
            } else {
                res.json({ result: false, error: 'Action invalide' });
            }

        } else {
            res.json({ result: false, error: "Erreur lors de la récupération de l'ID utilisateur" });
        }
    })
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