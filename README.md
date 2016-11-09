# A Firebase Custom Auth Example


# Getting Started

Install and Start dependencies:

```

npm install -g testrpc

# In a new terminal window

$ testrpc

```

Clone and install the repo:

```
$ git clone git@github.com:transmute-industries/monarch-firebase-custom-auth.git
$ cd monarch-firebase-custom-auth
$ npm install
$ npm run start

```

# How It Works

A web3 client with access to an account_address's private key generates a signature.

```
var account_address = web3.eth.accounts[0];
console.log( 'account_address: ', account_address);

// arbitrary transaction hash
var message = '8dfe9be33ccb1c830e048219729e8c01f54c768004d8dc035105629515feb38e';
console.log( 'message: ', message);

var signature = web3.eth.sign(account_address, message);
console.log( 'signature: ', signature);
```

The client posts this payload to /firebase-web3-token:

```
{
  "account_address" : account_address,
  "message": message,
  "signature": signature
}

```

Recover signing account address from public key with ecrecover:

```
var Web3 = require('web3');
var utils = require('ethereumjs-util');

var web3 = new Web3();

var postBody = {
  "account_address" : account_address,
  "message": message,
  "signature": signature
};

var signature = utils.stripHexPrefix(postBody.signature);

var r = new Buffer(signature.substring(0, 64), 'hex')
var s = new Buffer(signature.substring(64, 128), 'hex')
var v = new Buffer((parseInt(signature.substring(128, 130)) + 27).toString());

var messageBuffer = new Buffer(message, 'hex');
var pub = utils.ecrecover(messageBuffer, v, r, s);

var recoveredAddress = utils.addHexPrefix(utils.pubToAddress(pub).toString('hex'))

```

Generate a custom Token if the recoveredAddress is same as the account_address.

```

if (recoveredAddress === postBody.account_address){
  var uid = account_address;
  var additionalClaims = {
    premiumAccount: true,
    account_address: account_address
  };

  var token = firebase.auth().createCustomToken(uid, additionalClaims);
  return token;

}

```

On the client, we use the custom token to sign in as that account_address.

```
firebase.auth().signInWithCustomToken(token).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});
```

# Extended Reading

https://firebase.google.com/docs/auth/web/custom-auth

https://firebase.google.com/docs/auth/server/create-custom-tokens
