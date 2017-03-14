var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var cors = require('cors');

var config = require('./config');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(cors());

var mongoose = require('mongoose');
mongoose.connect(config.database);

app.get('/api', function (req, res, next) {
    res.json('online');
});

var Loja = require('./Loja');
var Produto = require('./Produto');

app.get('/api/lojas', function (req, res, next) {

    Loja.find({}, { _id: 1, nome: 1 }, function (err, lojas) {
        res.json(lojas);
    });

});

app.use('/', express.static('./web'));

server.listen(config.port, '0.0.0.0');
console.log('Server start: ' + config.port);
