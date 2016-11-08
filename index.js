
var Web3 = require('web3');
var utils = require('ethereumjs-util');

var web3 = new Web3();

var defaultProvider = new web3.providers.HttpProvider('http://localhost:8545');
web3.setProvider(defaultProvider);

var account_address = web3.eth.accounts[0];
console.log( 'account_address: ', account_address);

var message = '8dfe9be33ccb1c830e048219729e8c01f54c768004d8dc035105629515feb38e';
console.log( 'message: ', message);

var signature = web3.eth.sign(account_address, message);
console.log( 'signature: ', signature);

signature = utils.stripHexPrefix(signature);

var r = new Buffer(signature.substring(0, 64), 'hex')
var s = new Buffer(signature.substring(64, 128), 'hex')
var v = new Buffer((parseInt(signature.substring(128, 130)) + 27).toString());

// console.log('r s v: ', r, s , v)

// console.log('v: ', v)

var messageBuffer = new Buffer(message, 'hex');
var pub = utils.ecrecover(messageBuffer, v, r, s);

var recoveredAddress = utils.addHexPrefix(utils.pubToAddress(pub).toString('hex'))

console.log('recoveredAddress: ',   recoveredAddress);

console.log( 'isMatch: ', recoveredAddress === account_address );
