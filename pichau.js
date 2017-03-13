var Xray = require('x-ray');
var md5 = require('blueimp-md5');
var fs = require('fs');
var moment = require('moment');
var request = require('request');
var async = require('async');
var Q = require('q');

var xray = Xray({
  filters: {
    match: function (value, regex, index) {
        var reg = new RegExp(regex);
        var mat = value.match(reg);
        if (mat.length > index) {
            return mat[index];
        } else {
            return value;
        }
    },
    getLastPart: function (value) {
        var parts = value.split('/');
        return parts[parts.length - 1];
    },
    validaDisponivel: function (value) {
        if (value !== 'indisponível') {
            return true;
        } else {
            return false;
        }
    }
  }
});

//var url = 'http://www.pichau.com.br/hardware/placa-de-video';
//var url = 'http://www.pichau.com.br/hardware/processadores';
//var url = 'http://www.pichau.com.br/hardware/placa-m-e';

function extract(url) {
    var deferred = Q.defer();

    getPages(url).then(function (urls) {
        var allItems = [];

        var fila = async.queue(function (u, next) {
            getItensPage(u).then(function (items) {
                allItems = allItems.concat(items);
                next();
            });
        });

        fila.push(urls);

        fila.drain = function () {
            deferred.resolve(allItems);
        }
    });

    return deferred.promise;
}

function getPages(url) {
    var deferred = Q.defer();

    var hoje = moment().format('DD-MM-YYYY');
    var hash = md5(url) + ' - ' + hoje + '.html';

    withCache(hash, url).then(function (body) {
        xray(body, '.pager', {
            quantidade: 'p | match: .*\\d*.*\\s(\\d+), 1',
            ref: 'li a@href',
        })(function(err, res) {
            var urls = [];

            for (var i = 1; i <= res.quantidade; i++) {
                urls.push(url + '?p=' + i);
            }

            deferred.resolve(urls);
        });
    });

    return deferred.promise;
}

function getItensPage(url) {
    var deferred = Q.defer();

    var hoje = moment().format('DD-MM-YYYY');
    var hash = md5(url) + ' - ' + hoje + '.html';

    withCache(hash, url).then(function (body) {
        xray(body, '.item', [
        {
            img: 'img@src',
            link: '.amlabel-div a@href',
            id: '.amlabel-div a@href | getLastPart',
            title: '.title a@title',
            parcelado: '.other .valor',
            boleto: '.boleto .valor',
            boletoAdicional: '.boleto .adicional',
            disponivel: '.text-indisponivel | validaDisponivel'
        }
        ])(function(err, objs) {
            deferred.resolve(objs);
        });
    });

    return deferred.promise;
}

function withCache(hash, url) {
    var deferred = Q.defer();

    var pathCache = './cache/' + hash;

    var existe = fs.existsSync(pathCache);

    if (!existe) {
        request(url, function (error, response, body) {
            fs.writeFileSync(pathCache, body);
            deferred.resolve(body);
        });
    } else {
        var body = fs.readFileSync(pathCache);
        deferred.resolve(body);
    }

    return deferred.promise;
}

exports.extract = extract;
