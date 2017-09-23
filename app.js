var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var path = require('path');
var ejs = require('ejs-html');
var session = require('express-session');
var methodOverride = require("method-override");
var Aula = require('./models/model.aula');
var ListMember = require('./models/model.listmember');
var Comment = require('./models/model.comment');
var User = require('./models/model.user');
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
mongoose.connect("mongodb://matheus:matheus@ds139994.mlab.com:39994/heroku_8gpr6wtd", {useMongoClient: true}, function(){
	console.log("and MongoDB is ok!")
});
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({secret: 'work hard',resave: true,saveUninitialized: false}));
app.use(methodOverride("_method"));


// get routes

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
//post routes
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
//update routes
app.get("/aulas/:id/edit", function(req,res){
        Aula.findById(req.params.id, function(error,aula){
            if(error){
                console.log(error)
            }else{
                res.render("edit", {aula:aula})
            }
        })
})
/*app.put("/aulas/:id", function(req,res){
    Aula.findByIdAndUpdate(req.params.id, req.body.aula, function(error, obj){
        if(error){
            res.render("error", {error:error})
        }else{
            res.redirect("/aulas/"+req.params.id)
        }
    })
})*/
app.put("/aulas/:id", function(req,res){
    Aula.findByIdAndUpdate({_id: req.params.id}, req.body.blog, function(error,obj){
        if (error){
            console.log(error)
            res.render("error", {error: error})
        }else{
            res.redirect("/aulas/"+req.params.id)
        }
    });
});


app.listen(process.env.PORT || 3000, function(){
	console.log("Node on")
})