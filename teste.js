var kabum = require('./kabum');
var pichau = require('./pichau');
var terabyte = require('./terabyte');
var config = require('./config');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.database);


var url1 = 'http://www.kabum.com.br/hardware/processadores';
var url2 = 'http://www.pichau.com.br/hardware/processadores';
var url3 = 'http://www.terabyteshop.com.br/hardware/processadores';

kabum.extract(url1).then(function (items) {
    console.log(items.length, 'kabum');
});

pichau.extract(url2).then(function (items) {
    console.log(items.length, 'pichau');
});

terabyte.extract(url3).then(function (items) {
    console.log(items.length, 'terabyte');
});
