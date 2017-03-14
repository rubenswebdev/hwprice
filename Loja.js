var mongoose = require('mongoose');

var Schema = mongoose.Schema({
    nome: String,
    cpus: String,
    mbs: String,
    vgas: String,
});

module.exports = mongoose.model('Loja', Schema);
