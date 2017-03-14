var mongoose = require('mongoose');

var Schema = mongoose.Schema({
    img: String,
    link: String,
    id: String,
    title: String,
    parcelado: String,
    boleto: String,
    boletoAdicional: String,
    loja: { type: mongoose.Schema.ObjectId, ref: 'Loja' },
    disponivel: { type: Boolean, default: false },
});

module.exports = mongoose.model('Produto', Schema);
