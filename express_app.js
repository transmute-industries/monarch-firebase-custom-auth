var express = require('express')
var bodyParser = require('body-parser')
var Web3 = require('web3');
var utils = require('ethereumjs-util');
var firebase = require("firebase");

firebase.initializeApp({
  serviceAccount: process.env.FB_MONARCH_CHAIN_SERVICE_ACCOUNT,
  databaseURL: "https://transmute-industries.firebaseio.com"
});

var app = express()
var web3 = new Web3();

app.use(bodyParser());
app.use('/web3', express.static(__dirname + '/node_modules/web3/dist'));

app.get('/', function (req, res) {
  res.send(`
    <style>
      #login, #logout{
        float: right;
        color: #fff;
        background: #4A148C;
        font-size: 24px;
        cursor: pointer;
      }
      #loggedIn {
        display: none;
      }
    </style>
     <div id="loggedOut">
      <h3>Account Address:     <button onclick="login()" id="login">Login</button>  </h3>
      <pre id="account_address"></pre>
    </div>
    <div id="loggedIn">
      <h3>Logged in with Firebase UID: <button onclick="logout()" id="logout">Logout</button></h3>
      <pre id="firebase_uid"></pre>
    </div>
    <script src="https://www.gstatic.com/firebasejs/3.5.3/firebase.js"></script>
    <script>
      // Initialize Firebase
      var config = {
        apiKey: "AIzaSyDIXrTv0TD9zdaCy5n_QXm6_VMaS-1B3sQ",
        authDomain: "transmute-industries.firebaseapp.com",
        databaseURL: "https://transmute-industries.firebaseio.com",
        storageBucket: "transmute-industries.appspot.com",
        messagingSenderId: "1068223304219"
      };
      firebase.initializeApp(config);
    </script>
    <script src="/web3/web3.js"></script>
    <script>
    var web3 = new Web3();
    var defaultProvider = new web3.providers.HttpProvider('http://localhost:8545');
    web3.setProvider(defaultProvider);
    var account_address = web3.eth.accounts[0];
    document.getElementById('account_address').textContent = account_address;
    console.log( 'account_address: ', account_address);
    var message = 'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109';
    console.log( 'message: ', message);
    var signature = web3.eth.sign(account_address, message);
    console.log( 'signature: ', signature);
    firebase.auth().onAuthStateChanged(function(user){
        if (user) {
          console.log('logged in as firebase user: ', user)
          document.getElementById('firebase_uid').textContent = user.uid;
          document.getElementById('loggedIn').style.display = "block";
          document.getElementById('loggedOut').style.display = "none";
        } else {
            // error
            document.getElementById('loggedIn').style.display = "none";
            document.getElementById('loggedOut').style.display = "block";
        }
    });

    window.logout = function(){
      firebase.auth().signOut();
    }

    window.login = function(){
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "/token");
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(JSON.stringify({account_address:account_address, message:message, signature: signature}));
        xmlhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            console.log('got response from token: ', response);
            firebase.auth().signInWithCustomToken(response).catch(function(error) {
              // Handle Errors here.
              // var errorCode = error.code;
              // var errorMessage = error.message;
              // ...
            });
          }
    }
}
  </script>
  `);
})

app.post('/token', function (req, res) {
  var postBody = req.body;
  // var postBody = {
  //   "account_address" : account_address,
  //   "message": message,
  //   "signature": signature
  // };
  var signature = utils.stripHexPrefix(req.body.signature);
  var r = new Buffer(signature.substring(0, 64), 'hex')
  var s = new Buffer(signature.substring(64, 128), 'hex')
  var v = new Buffer((parseInt(signature.substring(128, 130)) + 27).toString());
  var messageBuffer = new Buffer(postBody.message, 'hex');
  var pub = utils.ecrecover(messageBuffer, v, r, s);
  var recoveredAddress = utils.addHexPrefix(utils.pubToAddress(pub).toString('hex'))
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

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
