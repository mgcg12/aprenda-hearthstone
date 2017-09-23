var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    nome: String,
    cmm: String,
    cidade: String
});
var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;