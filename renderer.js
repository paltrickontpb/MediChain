// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// BIGCHAINDB
const driver = require('bigchaindb-driver')
const fs = require('fs');

const alice = new driver.Ed25519Keypair()

let conn = new driver.Connection('https://test.bigchaindb.com/api/v1/', {
    app_id: 'edbd1767',
    app_key: '324661046cb0b6945cf264a92b79cce5'
})

async function getData(inputData){
    var bData
    let promise = new Promise((resolve, reject) => {
        conn.searchAssets(inputData)
        .then(assets => {
        bData = assets
        resolve(bData)
        })
    });
    
    let result = await promise;
    return result
}



//END BIGCHAINDB

// 2FACTOR AUTH
var twoFactor
var seshID 

//END 2FACTOR AUTH

const {ipcRenderer} = require('electron')

//LOGIN SEND
function initLogin(){
    
    var user = document.getElementById("username").value
    var pass = document.getElementById("password").value
    authenticateLogin(user,pass)
}
//END LOGIN

async function authenticateLogin(u,p){
    let flag = 0
    let value = await getData('someweirduniqueidforkeypassstuff')
    value.forEach(element => {
        if (u == element.data.username){
            if (p == element.data.passwd){
                flag = 1
                ipcRenderer.send('channel1', 'admin')
                json = JSON.stringify(element.data);
                fs.writeFile("session.json", json, function (err) {
                    if (err) {
                        return console.log("Error writing file: " + err);
                    }
                });

            } else {
                flag = 0
            }
        }
    });
    if (flag==0){
        alert("Please Enter Correct Credentials !")
    }
}

function logOut(){
    alert("Logging out")
    ipcRenderer.send('channel1', 'logout')
    
}

function queryPage(){
    window.location.href = "query.html";
    ipcRenderer.send('channel1', 'query')
}

function nameUpdate(){
    var a;

    fs.readFile('session.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data);
        console.log(obj);
        a = obj.username

        $("#nom").text(a)
        $("#headnom").text(a)
        $("#pnom").text("")
    }});

}  

function notAvail() {
    alert('Feature is not available yet ! Will be released soon');
}