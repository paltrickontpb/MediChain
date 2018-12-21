// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// BIGCHAINDB
const {ipcRenderer} = require('electron')
const driver = require('bigchaindb-driver')
const fs = require('fs');

let conn = new driver.Connection('https://test.bigchaindb.com/api/v1/', {
    app_id: 'edbd1767',
    app_key: '324661046cb0b6945cf264a92b79cce5'
})

var name
var pnum = "98765-12345"

//END BIGCHAINDB

// 2FACTOR AUTH
var twoFactor = ""
var seshID

//END 2FACTOR AUTH

//LOGIN SEND
function initLogin(){
    
    var user = document.getElementById("username").value
    var pass = document.getElementById("password").value

    name = user

    authenticateLogin(user,pass)
    
}
//END LOGIN

function authenticateLogin(u,p){
    if (u == 'admin'){
        if (p == 'admin') {
            ipcRenderer.send('channel1', 'admin')
       }
       else {
            alert('Wrong User or Password')
       }
    } else {
        alert('Wrong User or Password')
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
    var b;

    fs.readFile('session.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data);
        console.log(obj);
        a = obj.name
        b = obj.number

        $("#nom").text(a)
        $("#headnom").text(a)
        $("#pnom").text(b)
    }});

}  