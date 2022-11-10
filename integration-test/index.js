/* server.js - user & resource authentication */
// Modular version, with express routes imported separately.
'use strict';
const express = require('express')
// starting the express server
const app = express();


const newman = require('newman'); // require newman in your project

// call newman.run to pass `options` object and wait for callback
newman.run({
    collection: require('./sample-collection.json'),
    reporters: 'cli'
}, function (err) {
	if (err) { throw err; }
    console.log('collection run complete!');
});

// A route to test get request that requires authentication
app.get('/main', (req, res, next) => {
    var authheader = req.headers.authorization;
    console.log(authheader);
    var auth = new Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];
    if (user == 'test' && pass == 'test'){
        res.send('successfully authorized!');
    } else {
        var err = new Error('not authenticated');
        res.setHeader('WWW-Authnticate', 'Basic');
        err.status = 401;
        return next(err);
    }
})

app.listen(3000, () => {
    console.log("server is starting")
})
