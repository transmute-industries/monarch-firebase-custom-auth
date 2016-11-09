var web3 = new Web3();
var global_keystore;

var defaultProvider = new web3.providers.HttpProvider('http://localhost:8545');
web3.setProvider(defaultProvider);

var account_address = web3.eth.accounts[0];

var seed = 'inmate enhance silver evoke ensure minimum warrior welcome fragile pink relief hub'

console.log('seed: ', seed);

console.log('Ethereum Managed Account Address: ', account_address);


var lastFromAccountAddress;
var lastToAccountAddress;
var lastTransaction;
var lastSignature;

var lastPwDerivedKey;

var lastSignature = '0x5c503b92cd6e2a7dc0d2fcfb2f131536cd2e57ccb6cccd4c4c726ee33264f49b7e5cca029de7dd3c064d172a95ad4081ce8b12af66cdea90f136476e98a9c5ac1b';


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log('logged in as firebase user: ', user)

    } else {
        // error

    }
});

function setWeb3Provider(keystore) {
    var web3Provider = new HookedWeb3Provider({
        host: "http://localhost:8545",
        transaction_signer: keystore
    });

    web3.setProvider(web3Provider);
}


function getTokenFromSignature() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "/token");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify({
        account_address: lastFromAccountAddress,
        message: lastTransaction,
        signature: lastSignature
    }));
    xmlhttp.onreadystatechange = function() {
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

function newAddresses(password) {

    if (password == '') {
        password = prompt('Enter password to retrieve addresses', 'Password');
    }

    var numAddr = parseInt(document.getElementById('numAddr').value)

    lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {

        global_keystore.generateNewAddress(pwDerivedKey, numAddr);

        var addresses = global_keystore.getAddresses();

        for (var i = 0; i < addresses.length; ++i) {
            console.log(addresses[i]);
        }

        getBalances();
    })
}

function getBalances() {

    var addresses = global_keystore.getAddresses();
    document.getElementById('addr').innerHTML = 'Retrieving addresses...'

    async.map(addresses, web3.eth.getBalance, function(err, balances) {
        async.map(addresses, web3.eth.getTransactionCount, function(err, nonces) {
            document.getElementById('addr').innerHTML = ''
            for (var i = 0; i < addresses.length; ++i) {
                document.getElementById('addr').innerHTML += '<div>' + addresses[i] + ' (Bal: ' + (balances[i] / 1.0e18) + ' ETH, Nonce: ' + nonces[i] + ')' + '</div>'
            }
        })
    })

}

function signTransaction() {


    lastSignature = lightwallet.signing.concatSig(lightwallet.signing.signMsg(global_keystore, lastPwDerivedKey, lastTransaction, lastFromAccountAddress));


    console.log('lastSignature: ', lastSignature);
}


function setSeed() {

    var password = prompt('Enter Password to encrypt your seed', 'Password');

    lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {

        global_keystore = new lightwallet.keystore(
            document.getElementById('seed').value,
            pwDerivedKey);

        document.getElementById('seed').value = '';

        lastPwDerivedKey = pwDerivedKey;

        newAddresses(password);
        setWeb3Provider(global_keystore);

        getBalances();
    })
}

function newWallet() {
    var extraEntropy = document.getElementById('userEntropy').value;
    document.getElementById('userEntropy').value = '';
    var randomSeed = lightwallet.keystore.generateRandomSeed(extraEntropy);

    var infoString = 'Your new wallet seed is: "' + randomSeed +
        '". Please write it down on paper or in a password manager, you will need it to access your wallet. Do not let anyone see this seed or they can take your Ether. ' +
        'Please enter a password to encrypt your seed while in the browser.'

    var password = prompt(infoString, 'Password');

    lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {

        global_keystore = new lightwallet.keystore(
            randomSeed,
            pwDerivedKey);


        document.getElementById('sendFrom').value = web3.eth.accounts[0];

        newAddresses(password);
        setWeb3Provider(global_keystore);
        getBalances();
    })
}

function showSeed() {
    var password = prompt('Enter password to show your seed. Do not let anyone else see your seed.', 'Password');

    lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {
        var seed = global_keystore.getSeed(pwDerivedKey);
        alert('Your seed is: "' + seed + '". Please write it down.')
    })
}

function sendEth() {
    var fromAddr = document.getElementById('sendFrom').value
    var toAddr = document.getElementById('sendTo').value
    var valueEth = document.getElementById('sendValueAmount').value
    var value = parseFloat(valueEth) * 1.0e18
    var gasPrice = 50000000000
    var gas = 50000

    lastFromAccountAddress = fromAddr;
    lastToAccountAddress = toAddr;

    web3.eth.sendTransaction({ from: fromAddr, to: toAddr, value: value, gasPrice: gasPrice, gas: gas }, function(err, txhash) {
        console.log('error: ' + err)
        console.log('txhash: ' + txhash)

        lastTransaction = txhash;
    })
}

function functionCall() {
    var fromAddr = document.getElementById('functionCaller').value
    var contractAddr = document.getElementById('contractAddr').value
    var abi = JSON.parse(document.getElementById('contractAbi').value)
    var contract = web3.eth.contract(abi).at(contractAddr)
    var functionName = document.getElementById('functionName').value
    var args = JSON.parse('[' + document.getElementById('functionArgs').value + ']')
    var valueEth = document.getElementById('sendValueAmount').value
    var value = parseFloat(valueEth) * 1.0e18
    var gasPrice = 50000000000
    var gas = 3141592
    args.push({ from: fromAddr, value: value, gasPrice: gasPrice, gas: gas })
    var callback = function(err, txhash) {
        console.log('error: ' + err)
        console.log('txhash: ' + txhash)
    }
    args.push(callback)
    contract[functionName].apply(this, args)
}
