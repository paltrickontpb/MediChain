// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// BIGCHAINDB
const driver = require('bigchaindb-driver')
const fs = require('fs');
var request = require('request');

var nam
var num

const alice = new driver.Ed25519Keypair()

let conn = new driver.Connection('https://test.bigchaindb.com/api/v1/', {
    app_id: 'edbd1767',
    app_key: '324661046cb0b6945cf264a92b79cce5'
})

function getData(inputData){
    var bData
    return new Promise((resolve, reject) => {
        conn.searchAssets(inputData)
        .then(assets => {
        bData = assets
        resolve(bData)
        })
    });
}

//END BIGCHAINDB

// 2FACTOR AUTH
var seshID 
var twoFactor 

function auth2fa(phone){
    var api_key = '17fcc173-0415-11e9-a895-0200cd936042'
    var link = 'https://2factor.in/API/V1/'+api_key+'/SMS/+91'+ phone +'/AUTOGEN'
    request(link, function(e,res,body){
        seshID = body.Details
        alert("OTP Sent to Given Number, Enter it in the 2nd Box")
    })
}

function complete2fa(session,otp){

    var api_key = '17fcc173-0415-11e9-a895-0200cd936042'
    var link = 'https://2factor.in/API/V1/'+api_key+'/SMS/VERIFY/'+session+'/'+otp
    request(link, function(e,res,body){
        if(body.Details == 'OTP Matched'){
            getPatients();
        } else {
            alert("Wrong OTP, Try Again")
        }
    })
    
}

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
                if(u == 'projjal'){
                    ipcRenderer.send('channel1', 'user')
                } else {
                    ipcRenderer.send('channel1', 'admin')
                } 
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
        a = obj.username

        $("#nom").text(a)
        $("#headnom").text(a)
        $("#pnom").text("")
    }});

}  

function notAvail() {
    alert('Feature is not available yet ! Will be released soon');
}

async function getPatients() {
    var input = document.getElementById("pNum").value
    let value = await getData(input)

    $("#pName").text(value[0].data.name)
    $("#pAge").text(value[0].data.age)
    $("#pNumber").text(value[0].data.phone)
    $("#pBG").text(value[0].data.bloodgroup)
    $("#pGender").text(value[0].data.gender)
    $("#pAllerg").text(value[0].data.allergies)
    $('#pPrex').text(value[value.length-1].data.prescription)


    json = JSON.stringify(value[value.length-1].data);
    fs.writeFile("session2.json", json, function (err) {
    if (err) {
         return console.log("Error writing file: " + err);
     }
});
}

function getVisits(){
    ipcRenderer.send('channel1','visit')
}

function goPrex(){
    ipcRenderer.send('channel1','prex')
}

function prexAdd(){
    var obj
    getPatients()
    var dat = document.getElementById("prex").value

    fs.readFile('session2.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data);
        obj.prescription += String(dat)
        obj.prescription += "\n"
        pushDB(obj);
        }
    })
    
}

function pushDB(data){

    var metadata = {
        info: 'Medichain Metadata'
    }

    const tx = driver.Transaction.makeCreateTransaction(
        data,
        metadata,
    
        // A transaction needs an output
        [ driver.Transaction.makeOutput(
                driver.Transaction.makeEd25519Condition(alice.publicKey))
        ],
        alice.publicKey
    )

    const txSigned = driver.Transaction.signTransaction(tx, alice.privateKey)

    conn.postTransactionCommit(txSigned)
    .then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))
}

function getOTP(){
    var number = document.getElementById("pNum").value
    auth2fa(number)
}

function finOTP(){
    var number = document.getElementById("pOTP").value
    complete2fa(seshID,number);
}

function goDonor(){
    window.location.href = "donor.html";
    ipcRenderer.send('channel1', 'donor')
}

function getBlood(){
    
}