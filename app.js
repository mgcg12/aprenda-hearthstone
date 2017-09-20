var express = require("express");
var app = express();
var path = require('path');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))


app.get("/", function(req,res){
	res.render("home")
})
app.get("/aulas", function(req,res){
	res.render("aulas")
})
app.get("/sobre", function(req,res){
	res.render("sobre")
})

app.listen(process.env.PORT || 3000, function(){
	console.log("Site on")
})