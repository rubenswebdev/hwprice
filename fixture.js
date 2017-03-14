var config = require('./config');
var async = require('async');

var Loja = require('./Loja');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.database);

var lojas = [
    {
        nome: 'Pichau',
        cpus: 'http://www.pichau.com.br/hardware/processadores',
        mbs: 'http://www.pichau.com.br/hardware/placa-m-e',
        vgas: 'http://www.pichau.com.br/hardware/placa-de-video',
    },
    {
        nome: 'Kabum',
        cpus: 'http://www.kabum.com.br/hardware/processadores',
        mbs: 'http://www.kabum.com.br/hardware/placas-mae',
        vgas: 'http://www.kabum.com.br/hardware/placa-de-video-vga',
    },
    {
        nome: 'Terabyte',
        cpus: 'http://www.terabyteshop.com.br/hardware/processadores',
        mbs: 'http://www.terabyteshop.com.br/hardware/placas-mae',
        vgas: 'http://www.terabyteshop.com.br/hardware/placas-de-video',
    },
];

async.each(lojas, function (loja, next) {

    Loja.findOne(loja, function (err, l) {
        if (!l) {
            l = new Loja(loja);
            l.save(function () {
                console.log('loja criada');
                next();
            });
        } else {
            console.log('loja já cadastrada');
            next();
        }
    });

}, function (err) {

    console.log('done');
});
