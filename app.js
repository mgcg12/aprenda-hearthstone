var express = require("express");
var app = express();
var path = require('path');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))


app.get("/", function(req,res){
	res.render("pages/home")
})

app.listen(3002,"localhost", function(){
	console.log("Site on")
})