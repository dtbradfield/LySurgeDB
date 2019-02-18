let fs = require('fs');
let http = require('http');
let path = require('path');
let methods = require('methods');
let express = require('express');
let bodyParser = require('body-parser');
let session = require('express-session');
let cors = require('cors');
let passport = require('passport');
let errorhandler = require('errorhandler');
let mongoose = require('mongoose');

let isProduction = process.env.NODE_ENV === 'production';

let app = express;

app.use(cors());

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));

app.use(session({ secret: 'lysurge', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

if (!isProduction) {
    app.use(errorhandler());
}

if (isProduction) {
    mongoose.connect(process.env.MONGODB_URI);
} else {
    mongoose.connect('mongodb://localhost/conduit');
    mongoose.set('debug', true);
}

require('./models/User');
require('./config/passport')

app.use(require('./routes'));

//Catch 404 and fwd to err handler, also do error handle:

app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//errors w stacktrace, then without:
if (!isProduction) {
    app.use((err, req, res, next) => {
        console.log(err.stack);
        res.status(err.status || 500);
        res.json({'errors': {
            message: err.message,
            error: err
        }});
    });
};

//no stacktrace, for production:
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({'errors': {
        message: err.message,
        error: {}
    }});
});

//fire that puppy up
let server = app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on port ' + server.address().port);
});