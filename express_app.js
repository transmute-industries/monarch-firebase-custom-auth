var express = require('express')
var bodyParser = require('body-parser')
var Web3 = require('web3');
var utils = require('ethereumjs-util');
var firebase = require("firebase");
var path = require("path");

firebase.initializeApp({
    serviceAccount: process.env.FB_MONARCH_CHAIN_SERVICE_ACCOUNT,
    databaseURL: "https://transmute-industries.firebaseio.com"
});

var app = express()
var web3 = new Web3();

app.use(bodyParser());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/token.html'));
})

app.get('/wallet', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/wallet.html'));
})

app.post('/token', function(req, res) {
    var postBody = req.body;

    console.log('postBody: ', postBody);


    var signature = utils.stripHexPrefix(req.body.signature);
    var r = new Buffer(signature.substring(0, 64), 'hex')
    var s = new Buffer(signature.substring(64, 128), 'hex')
    var v = new Buffer((parseInt(signature.substring(128, 130)) + 27).toString());
    var messageBuffer = new Buffer(postBody.message, 'hex');
    var pub = utils.ecrecover(messageBuffer, v, r, s);
    var recoveredAddress = utils.addHexPrefix(utils.pubToAddress(pub).toString('hex'))
    console.log('recoveredAddress: ', recoveredAddress);
    if (recoveredAddress === postBody.account_address) {
        var uid = postBody.account_address;
        var additionalClaims = {
            premiumAccount: true,
            account_address: postBody.account_address
        };
        var token = firebase.auth().createCustomToken(uid, additionalClaims);
        res.send(token)
    } else {
        console.log('NOT A MATCH')
        res.send(null)
    }
})

app.listen(3000, function() {
    console.log('Example app listening on port 3000!')
})
