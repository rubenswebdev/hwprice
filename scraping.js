var kabum = require('./kabum');
var pichau = require('./pichau');
var terabyte = require('./terabyte');
var config = require('./config');
var Loja = require('./Loja');
var Produto = require('./Produto');
var async = require('async');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.database);

Loja.find({}, function (err, lojas) {
    lojas.forEach(function (l) {
        filaScrap.push({ nome: l.nome.toLowerCase(), url: l.cpus, loja: l._id });
        filaScrap.push({ nome: l.nome.toLowerCase(), url: l.mbs, loja: l._id });
        filaScrap.push({ nome: l.nome.toLowerCase(), url: l.vgas, loja: l._id });
    });
});

var filaScrap = async.queue(function (task, next) {
    console.log(task);
    var parser = require('./' + task.nome);
    parser.extract(task.url).then(function (items) {

        console.log('items', items);

        async.each(items, function (prod, nextE) {
            Produto.findOne({ id: prod.id, loja: task.loja }, function (err, produto) {
                if (!produto) {
                    produto = new Produto(prod);
                    produto.loja = task.loja;
                    produto.save(function () {
                        nextE();
                    });
                } else {
                    produto.img = prod.img;
                    produto.link = prod.link;
                    produto.id = prod.id;
                    produto.title = prod.title;
                    produto.parcelado = prod.parcelado;
                    produto.boleto = prod.boleto;
                    produto.boletoAdicional = prod.boletoAdicional;
                    produto.loja = task.loja;
                    produto.disponivel = prod.disponivel;

                    console.log('Produto Atualizado', produto);
                    produto.save(function () {
                        nextE();
                    });
                }
            });
        },

        function () {
            console.log(items.length, task.nome);
            next();
        });

    });
});

filaScrap.drain = process.exit;
