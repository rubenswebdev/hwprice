var elasticsearch = require('elasticsearch');
var esClient = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error',
});

function bulkIndex(index, type, data) {
    let bulkBody = [];

    data.forEach(item => {
        console.log(item);
        bulkBody.push({
            update: {
                _index: index,
                _type: type,
                _id: item.id,
            },
        });

        bulkBody.push(item);
    });

    esClient.bulk({ body: bulkBody })
    .then(response => {
        let errorCount = 0;
        response.items.forEach(item => {
            if (item.index && item.index.error) {
                console.log(++errorCount, item.index.error);
            }
        });
        console.log(
          `Successfully indexed ${data.length - errorCount}
       out of ${data.length} items`
        );
    })
    .catch(console.err);
};

var config = require('./config');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.database);

var Produto = require('./Produto');

Produto.find({}, { _id: 0 }, function (err, produtos) {
    bulkIndex('library', 'produtos', produtos);
});

