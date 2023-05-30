//new code inserted
const https = require('https')
const fs=require('fs');

var express = require('express');
var serveStatic = require('serve-static');
var app = require('./controller/app.js');

var port = 8081;
app.use(serveStatic(__dirname + '/public')); 

//new code inserted
https.createServer({
    key: fs.readFileSync('./cert/localhost+2-key.pem'),
    cert: fs.readFileSync('./cert/localhost+2.pem'),
    requestCert: false,
    rejectUnauthorized: false,
}, app).listen(port, function(){
    console.log('Web App Hosted at https://localhost/%s', port);
});

var app = require('./controller/app.js');

