var elasticsearch = require('elasticsearch');
var esClient = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error',
});

const indices = function indices() {
    return esClient.cat.indices({ v: true })
    .then(console.log)
    .catch(err => console.error(`Error connecting to the es client: ${err}`));
};

indices();
