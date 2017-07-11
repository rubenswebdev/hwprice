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

app.get('/api/lojas', function (req, res) {

    Loja.find({}, { _id: 1, nome: 1 }, function (err, lojas) {
        res.json(lojas);
    });

});

//db.produtos.createIndex( { title: "text" } );
app.post('/api/produtos', function (req, res) {
    Produto.find({ $text: { $search: req.body.termo }, loja: req.body._id, disponivel: false }, function (err, produtos) {
        res.json(produtos);
    });
});

var elasticsearch = require('elasticsearch');
var esClient = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error',
});

app.post('/api/produtos-e', function (req, res) {

    var body = {
        size: 100,
        from: 0,
        query: {
            match: {
                title: {
                    query: req.body.termo,
                    operator: 'and',
                },
            },
        },
    };

    esClient.search({ index: 'library', body: body }).then(function (results) {
        var r = [];
        results.hits.hits.forEach(function (item, index) {
            r.push(item._id);
        });

        Produto.find({ id: { $in: r }, loja: req.body._id })
        .sort({ disponivel: -1 })
        .exec(function (err, produtos) {
            res.json(produtos);
        });
    });
});

app.use('/', express.static('./web'));

server.listen(config.port, '0.0.0.0');
console.log('Server start: ' + config.port);
