var mongoose = require("mongoose");

var listMemberSchema = new mongoose.Schema({
    email: String
});
var ListMember = mongoose.model("ListMember", listMemberSchema);

module.exports = ListMember;