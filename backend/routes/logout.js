const express = require('express');
const app = express.Router();

//logout
app.post('/logout', function (req, res) {
    console.log('POST Logout!');
    
    res.writeHead(200, {
        'Content-type': 'text/plain'
    });
    res.end('Back to login!');

});

module.exports = app;