var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
  //generate a unique requestId
  req.log.info({workerId: req.workerId}, 'hey hey');
  //process.nextTick(function(){
  //  throw new Error('Kaboom!'); });
  res.send(new Date().toJSON());
});

//router.get('/emailAli', function(req, res){
//
//  emailer.sendPaymentSuccessEmail({userEmail: 'fathalian@outlook.com', userName : 'dragon', userTrack: 'dummy', trackId: 'frontend'}, function(){});
//  res.status(200).send('Spamming fathalian@outlook.com');
//});
module.exports = router;
