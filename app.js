var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var path = require('path');
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
mongoose.connect("mongodb://matheus:matheus@ds139994.mlab.com:39994/heroku_8gpr6wtd", {useMongoClient: true}, function(){
	console.log("and MongoDB is ok!")
});
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))



// SCHEMA SETUP

var commentSchema = new mongoose.Schema({
    nome: String,
    cmm: String,
    cidade: String
});
var Comment = mongoose.model("Comment", commentSchema);


var listMemberSchema = new mongoose.Schema({
    email: String
});
var ListMember = mongoose.model("ListMember", listMemberSchema);

var aulaSchema = new mongoose.Schema({
    nome: String,
    descricao: String,
    conteudo: String
});
var Aula = mongoose.model("Aula", aulaSchema);

//

app.get("/", function(req,res){
    // GET ALL CMMS FROM DB
    Comment.find({}, function(error, comment){
        if(error){
            console.log(error)
        } else{
            res.render("home", {comment: comment});
        }
    });
    

})

app.get("/aulas", function(req, res){
	var json = {};
    
    Comment.find(function(err, comment) {
    json.comment = comment;
    Aula.find(function (error, aula) {
      json.aulas = aula;
      res.render("aulas", json);
   
    })})
});


app.get("/sobre", function(req,res){
	res.render("sobre")
})
app.get("/novaAula", function(req,res){
	res.render("novaAula")
})

app.post("/addCmm", function(req,res){
    console.log("/addCmm Route acessed!");
    var nome = req.body.nome;
    var cmm = req.body.cmm;
    var cidade = req.body.cidade;
    var newCmm = {nome: nome, cmm: cmm, cidade: cidade};
    Comment.create(newCmm, function(error, comment){
        if (error){
            console.log(error)
        } else {
            console.log("'" + nome + "' comentou '" + cmm + "'.");
        	res.redirect("/aulas")
        }
    });
})

app.post("/addNewsletter", function(req,res){
    console.log("/addNewsletter Route acessed!");
    var email = req.body.email;
    var newListMember = {email: email};
    ListMember.create(newListMember, function(error, email){
        if (error){
            console.log(error)
        } else {
            console.log(req.body.email + " se cadastrou na Newsletter" );
        	res.redirect("/aulas")
        }
    });
})

app.post("/addAula", function(req,res){
    console.log("/addAula Route acessed!");
    var nome = req.body.nome;
    var descricao = req.body.descricao;
    var conteudo = req.body.conteudo;
    var newAula = {nome: nome, descricao: descricao, conteudo: conteudo};
    Aula.create(newAula, function(error, aula){
        if (error){
            console.log(error)
        } else {
            console.log("Aula '" + req.body.nome + "'' adicionada!" );
        	res.redirect("/aulas")
        }
    });
})

app.listen(process.env.PORT || 3000, function(){
	console.log("Node on")
})