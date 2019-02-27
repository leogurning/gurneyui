const express 	= require('express');
const morgan      = require('morgan');
const path = require('path');

const port = process.env.PORT || '2010';

const app = express();

// Enable CORS from client-side
app.use(function(req, res, next) {  
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    if ('OPTIONS' === req.method) { res.sendStatus(204); } else { next(); }
});

app.use(express.static(path.join(__dirname, 'public')));

// use morgan to log requests to the console
app.use(morgan('dev'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// kick off the server 
app.listen(port);

console.log('Gurney app is listening at PORT:' + port);