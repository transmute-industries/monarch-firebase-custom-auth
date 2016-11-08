

var argv = require('minimist')(process.argv.slice(2));
var prompt = require('prompt');

var firebase = require("firebase");
firebase.initializeApp({
    serviceAccount: process.env.FB_MONARCH_CHAIN_SERVICE_ACCOUNT,
    databaseURL: "https://transmute-industries.firebaseio.com"
});

var ipfsAPI = require('ipfs-api');
// var ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', procotol: 'https'})
var ipfs = ipfsAPI('localhost', '5001', { protocol: 'http' }) // leaving out the arguments will default to these values

var crypt = require('./crypt');

console.log('Begin Credentials...\n')

var db = firebase.database();
var ref = db.ref("custom-auth-demo");

// console.dir(argv);

if (argv['set-credentials']) {

    prompt.get(['username', 'password'], function (err, result) {

        crypt.cryptPassword(result.password, (err, hash) => {

            console.log('Saving Credentials:');
            console.log('  username: ' + result.username);
            // console.log('  password: ' + result.password);
            console.log('  hash: ', hash)

            ref.set({
                username: result.username,
                password: hash
            });
        })

    });

}

if (argv['test-credentials']) {

    var remoteCredentials;

    ref.on("value", function (snapshot) {

        remoteCredentials = snapshot.val();
        // console.log('remoteCredentials: ', remoteCredentials);

        prompt.get(['username', 'password'], function (err, result) {

            crypt.comparePassword(result.password, remoteCredentials.password, (err, isPasswordMatch) => {

                if (isPasswordMatch) {
                    console.log('success correct password!');
                } else {
                    console.log('failure incorrect password!');
                }
            })

        });

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

}

// var username = 'bob';
// var password = 'password';

// console.log('Store these in DB on registration...\n')

// crypt.comparePassword(password, 'password', (err, isPasswordMatch) =>{

//     if (isPasswordMatch){
//         console.log( 'success correct password!');
//     } else {
//         console.log( 'failure correct password!');
//     }

// })

// console.log('isValid: ', testCredentials(username, password), username, password);
// var testCredentials = (username, password) => {
//     return false
// }

// var setCredentials = (username, password) => {
//     return false
// }

// setCredentials(username, password);


// var a = '$2a$10$6vFObymVII9hrxRPIskMPOSwnfBDtcTU/UUaPnrWmYMt7GRKQhMaG';
// var b = '123';

// crypt.comparePassword(b, a, (err, isPasswordMatch) => {

//     if (isPasswordMatch) {
//         console.log('success correct password!');
//     } else {
//         console.log('failure incorrect password!');
//     }
// })