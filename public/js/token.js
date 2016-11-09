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