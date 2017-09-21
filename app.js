var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var path = require('path');
var ejs = require('ejs-html');
var session = require('express-session');
var bcrypt = require('bcrypt');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
mongoose.connect("mongodb://matheus:matheus@ds139994.mlab.com:39994/heroku_8gpr6wtd", {useMongoClient: true}, function(){
	console.log("and MongoDB is ok!")
});
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({secret: 'work hard',resave: true,saveUninitialized: false}));


// SCHEMA SETUP
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  passwordConf: {
    type: String,
    required: true,
  }
});


// autenticar usuário

UserSchema.statics.authenticate = function (username, password, callback) {
  User.findOne({ username: username })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}
//

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

var User = mongoose.model('User', UserSchema);

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
    autor: String,
    data: String,
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

app.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

app.get("/sobre", function(req,res){
	res.render("sobre")
})
app.get("/criar-aula", function(req,res){
    res.render("novaAula")
})
app.get("/criar-conta", function(req,res){
    res.render("novoUser")
})
app.get("/login", function(req,res){
	res.render("login")
})

app.post("/addUser", function(req,res){
    console.log("/addUser Route acessed!");
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var passwordConf = req.body.passwordConf;
    var newUser = {email: email, username: username, password: password, passwordConf:passwordConf};
    User.create(newUser, function(error, user){
        if (error){
            console.log(error)
        } else {
            console.log("'" + username + "' criou uma conta!");
            res.redirect("/")
        }
    });
})

app.post("/login", function(req,res){
    console.log("/login Route acessed!");
    var username = req.body.username;
    var password = req.body.password;
    var _id = req.session.userId
    console.log(req.session.userId)

    res.redirect("/")
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
    var autor = req.body.autor;
    var data = req.body.data;
    var nome = req.body.nome;
    var descricao = req.body.descricao;
    var conteudo = req.body.conteudo;
    var newAula = {autor: autor, data: data, nome: nome, descricao: descricao, conteudo: conteudo};
    Aula.create(newAula, function(error, aula){
        if (error){
            console.log(error)
        } else {
            console.log("Aula '" + req.body.nome + "'' adicionada!" );
        	res.redirect("/aulas")
        }
    });
})
app.get("/aulas/:id", function(req, res) {
    Aula.findById(req.params.id, function(error, aulaEncontrada){
        if (error) {
            console.log(error)
        } else {
            console.log("Página da aula '" + aulaEncontrada.nome + "' foi visualizada.");
            res.render("show", {aula: aulaEncontrada});
        }
    });
})

app.listen(process.env.PORT || 3000, function(){
	console.log("Node on")
})