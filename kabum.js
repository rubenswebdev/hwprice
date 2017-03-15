var Xray = require('x-ray');
var md5 = require('blueimp-md5');
var fs = require('fs');
var moment = require('moment');
var request = require('request');
var async = require('async');
var Q = require('q');
var URL = require('url');

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
        if (value !== '#') {
            return true;
        } else {
            return false;
        }
    }
  }
});

var url = 'http://www.kabum.com.br/hardware/placas-mae';
//var url = 'http://www.kabum.com.br/hardware/processadores';
//var url = 'http://www.kabum.com.br/hardware/placa-de-video-vga';
extract(url);
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
        xray(body, '.listagem-paginacao td:last-child', {
            url: 'a:last-child@href',
        })(function(err, res) {
            var queryParts = URL.parse(url + res.url, true);

             var urls = [];

            for (var i = 1; i <= queryParts.query.pagina; i++) {
                urls.push(url + '?pagina=' + i);
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
        xray(body, '.listagem-box', [
        {
            img: '.listagem-img a img@src',
            link: '.listagem-img a@href',
            id: '.listagem-img a@href | getLastPart',
            title: '.listagem-titulo_descr a',
            parcelado: '.listagem-preco12x',
            boleto: '.listagem-preco',
            boletoAdicional: '.H-15desc',
            disponivel: '.listagem-bots a:first-child@href | validaDisponivel'
        }
        ])(function(err, objs) {
            console.log(objs[0].title);
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
