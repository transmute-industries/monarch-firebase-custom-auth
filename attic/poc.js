
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

signature = signature.split('x')[1];

var r = new Buffer(signature.substring(0, 64), 'hex')
var s = new Buffer(signature.substring(64, 128), 'hex')
var v = new Buffer((parseInt(signature.substring(128, 130)) + 27).toString());

// console.log('r s v: ', r, s , v)

// console.log('v: ', v)

var messageBuffer = new Buffer(message, 'hex');
var pub = utils.ecrecover(messageBuffer, v, r, s);

var recoveredAddress = '0x' + utils.pubToAddress(pub).toString('hex')

console.log('recoveredAddress: ',   recoveredAddress);

console.log( 'isMatch: ', recoveredAddress === account_address );


// var Web3 = require('web3');
// var web3 = new Web3();

// console.log('TEST NET: ', process.env.INFURA_TESTNET);
//
// var defaultProvider = new web3.providers.HttpProvider(process.env.INFURA_TESTNET);
//
//
// web3.setProvider(defaultProvider);

// console.log('coinbase: ', web3.eth.accounts)
// console.log('accounts: ', web3.eth.accounts)

// var passphrase = '#stonetear';
//
// var account_address = "0x2095DB5e1BFC5DcB11CAa8A74a0C6A1fb2cC8c70";
// var account_balance = web3.eth.getBalance(account_address).toNumber();
//
// console.log('account_address: ', account_address)
// console.log('account_balance: ', account_balance)
//
//
// // var login_account = '0x94cC8e689f429666B02Fa8C265DC055D941D6953';

// web3.eth.sendTransaction({
//     from: account_address,
//     to: login_account,
//     value: account_balance * .0001,
//     data: web3.toHex('John Doe sent you a message')
// })

// var ethUtil = require('ethereumjs-util');

// var transactionHash = '0x246887248a64dee26c4aafeb400361fe17ab0697cfeb9788ba5109e27146be62';
// transactionHash = transactionHash.split('x')[1];
// transactionHash = new Buffer(transactionHash, 'hex');
//
//
// var signedTransactionHash = '0x1c70738b0812a3fb951d3c25c4c1c55c09a84ef95fd4f0f02ba29cfd7189a1dc1480dd79193935ecd4c6e47a4547e2d5065c7d00daf595d4b1d1908ca63ae09401';
// signedTransactionHash = signedTransactionHash.split('x')[1];
//
// var r = new Buffer(signedTransactionHash.substring(0, 64), 'hex')
// var s = new Buffer(signedTransactionHash.substring(64, 128), 'hex')
// var v = new Buffer((parseInt(signedTransactionHash.substring(128, 130)) + 27).toString());
//
// console.log('r s v: ', r, s , v)
//
// // console.log('v: ', v)
//
// var result = ethUtil.ecrecover(transactionHash, v, r, s);
//
// console.log('ethUtil.ecrecover result: ',   result.toString('hex'));
