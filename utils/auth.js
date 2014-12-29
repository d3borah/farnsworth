/**
 * Created by Fathalian on 12/24/14.
 */

var Auth0 = require('auth0');
var extend = require('xtend');
var jwt = require('express-jwt');

//use this JwtCheck to protect an endpoint
//app.use('/api/path-you-want-to-protect', jwtCheck);
var jwtCheck = jwt({
    secret: new Buffer('89RD41yJr3ZS7iCgBm84hYb4pRZq7WLPt23S772WffMELwP0soXn0PuM8PvxTxQg', 'base64'),
    audience: 'z43qm3GO3svkAThEf64k6W1j2EnZIXWl'
});

var api = new Auth0({
    domain: 'zyring.auth0.com',
    clientID: 'z43qm3GO3svkAThEf64k6W1j2EnZIXWl',
    clientSecret: '89RD41yJr3ZS7iCgBm84hYb4pRZq7WLPt23S772WffMELwP0soXn0PuM8PvxTxQg'
});

var CONNECTION = 'Username-Password-Authentication';

function signUpUser(req, callback) {
    var data = extend(req.body, {connection: CONNECTION, email_verified: false});
    api.createUser(data, callback);
}

module.exports = {
    authCheck: jwtCheck,
    signUp: signUpUser
}

