var elasticsearch = require('elasticsearch');
var esClient = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error',
});

const search = function search(index, body) {
    return esClient.search({ index: index, body: body });
};

const test = function test() {
    let body = {
        size: 20,
        from: 0,
        query: {
            // fuzzy: {
            //     title: 'gigabite z170'
            // }
            match: {
                title: {
                    query: 'i7',
                    operator: 'and',

                    //fuzziness: 1,
                },
            },
        },
    };

    search('library', body)
    .then(results => {
        console.log(results.hits);
        console.log(`found ${results.hits.total} items in ${results.took}ms`);
        console.log(`returned article titles:`);
        results.hits.hits.forEach(
          (hit, index) => console.log(
            ` ${body.from + ++index} - ${hit._source.title} - ${hit._source.loja}`
          )
        );
    })
    .catch(console.error);
};

test();
