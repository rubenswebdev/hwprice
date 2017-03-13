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
        if (value !== 'Todos vendidos ') {
            return true;
        } else {
            return false;
        }
    }
  }
});

//var url = 'http://www.terabyteshop.com.br/hardware/placas-de-video';
//var url = 'http://www.terabyteshop.com.br/hardware/processadores';
//var url = 'http://www.terabyteshop.com.br/hardware/placas-mae';

function extract(url) {
    var deferred = Q.defer();

    getPages(url, 1).then(function (urls) {
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

function getPages(urlOriginal, pag) {
    var deferred = Q.defer();

    url = urlOriginal + '?ppg=' + pag;

    var hoje = moment().format('DD-MM-YYYY');
    var hash = md5(url) + ' - ' + hoje + '.html';

    withCache(hash, url).then(function (body) {

        try {
            var bodyJson = JSON.parse(body);
        } catch(err) {
        }

        if (bodyJson) {
            body = bodyJson.src + bodyJson.bpg;
        }

        xray(body, '#pdmore@data-pg')(function(err, res) {
            if (res) {
                return getPages(urlOriginal, res).then(function () {
                    var queryParts = URL.parse(url, true);

                    var urls = [];

                    for (var i = 1; i <= queryParts.query.ppg; i++) {
                        urls.push(urlOriginal + '?ppg=' + i);
                    }

                    deferred.resolve(urls);
                });
            } else {
                var queryParts = URL.parse(url, true);

                var urls = [];

                for (var i = 1; i <= queryParts.query.ppg; i++) {
                    urls.push(urlOriginal + '?ppg=' + i);
                }

                deferred.resolve(urls);
            }

        });
    });

    return deferred.promise;
}

function getItensPage(url) {
    var deferred = Q.defer();

    var hoje = moment().format('DD-MM-YYYY');
    var hash = md5(url) + ' - ' + hoje + '.html';

    withCache(hash, url).then(function (body) {

        try {
            var bodyJson = JSON.parse(body);
        } catch(err) {
        }

        if (bodyJson) {
            body = bodyJson.src + bodyJson.bpg;
        }

        xray(body, '.pbox', [
        {
            img: '.commerce_columns_item_image:last-child img:last-child@src',
            link: '.commerce_columns_item_image:last-child@href',
            id: '.commerce_columns_item_image:last-child@href | getLastPart',
            title: '.commerce_columns_item_image:last-child@title',
            parcelado: '.prod-juros',
            boleto: '.prod-new-price span',
            boletoAdicional: '.prod-new-price small',
            disponivel: '.tbt_esgotado | validaDisponivel'
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
