
var argv = require('minimist')(process.argv.slice(2));
var prompt = require('prompt');

var firebase = require("firebase");
firebase.initializeApp({
    serviceAccount: process.env.FB_MONARCH_CHAIN_SERVICE_ACCOUNT,
    databaseURL: "https://transmute-industries.firebaseio.com"
});

var Web3 = require('web3');
var web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

console.log('accounts: ', web3.eth.accounts)


// var ac_a = web3.eth.accounts[0];
// var ac_b = web3.eth.accounts[1]


// web3.eth.getBalance(ac_a, function (error, result) {

//     var account_balance = result.toNumber(10);

//     console.log('account_balance: ', account_balance);

//     web3.eth.sendTransaction({
//         from: ac_a,
//         to: ac_b,
//         value: account_balance * .001,
//         data: web3.toHex('John Doe sent you a message')
//     })

// })

// var metacoin_address = '0x05ef96734ff99f2ea78bceaa98edb4879a53cbf3'

// // get abi
// var abi = require('./metacoin.abi.json')

// var MetaCoin = web3.eth.contract(abi);
// var mcInstance = MetaCoin.at('0x78e97bcc5b5dd9ed228fed7a4887c0d7287344a9');


// console.log( 'mcInstance: ', mcInstance );

// would stop and uninstall the filter
// myEvent.stopWatching();


// console.log(' lol getBalanceInEth: ', mc.getBalanceInEth('0xa4024b69b037666656de3681057037e78681b4ad')) 



// // creation of contract object
// var MetaCoin = web3.eth.contract(abi);

// // Instantiate from an existing address:
// var mcInstance = MetaCoin.at(metacoin_address);



// var account_address = 

// web3.eth.getBalance(account_address, function (error, result) {

//     var account_balance = result.toNumber(10);
//     console.log('account_balance: ', account_balance);

//     web3.eth.sendTransaction({
//         from: coinbase,
//         to: account_address,
//         value: account_balance * .001,
//         data: web3.toHex('John Doe sent you a message')
//     })


// })

// var db = firebase.database();
// var ref = db.ref("custom-auth-demo");

// console.dir(argv, ref);

// if (argv['set-credentials']) {

//     prompt.get(['username', 'password'], function (err, result) {

//         crypt.cryptPassword(result.password, (err, hash) => {

//             console.log('Saving Credentials:');
//             console.log('  username: ' + result.username);
//             // console.log('  password: ' + result.password);
//             console.log('  hash: ', hash)

//             ref.set({
//                 username: result.username,
//                 password: hash
//             });
//         })

//     });

// }