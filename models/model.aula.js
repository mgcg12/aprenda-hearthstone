var mongoose = require("mongoose");

var aulaSchema = new mongoose.Schema({
    autor: String,
    data: String,
    nome: String,
    descricao: String,
    conteudo: String
});
var Aula = mongoose.model("Aula", aulaSchema);

module.exports = Aula;