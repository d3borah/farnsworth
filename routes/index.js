var express = require('express');
var router = express.Router();
var feedly = require('../model/feedlyModel');


router.get('/', function(req, res){
    res.send('Good News Everyone its ' + new Date().toString());
});


router.get('/healthCheck', function(req, res){
    res.status(200).send();
});

router.get('/version', function(req, res){
    var GIT_VERSION = '__GIT_VERSION__';
    req.log.info('version');
    res.send(GIT_VERSION);
});

router.get('/categories', function (req, res) {
    feedly.getCategories(function (err, result) {
        if (err) {
            req.log.error(err);
            res.status(500).send();
        } else {
            res.json(result);
        }
    });
});

router.get('/categories/:catId', function (req, res) {

    var catId = req.params.catId;
    var continuation = req.query.continuation || '0';
    feedly.getNews(catId, continuation, function (err, result) {

        if (err) {
            req.log.error(err);
            if (err.notFound) {
                res.status(404).send('Category ' + catId + ' does not exist');
            } else {
                res.status(500).send();
            }
        } else {

            res.json(result);
        }
    });


});

module.exports = router;
