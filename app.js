//On load les librairies 
var express = require('express');
var path = require('path');
var logger = require('morgan');

//On crée l'index des routes 
var indexRouter = require('./routes/index.js');

//On initialise l'app 
var app = express();

//On utilise morgan pour les logs 
app.use(logger('short'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//On redirige la racine sur l'index des routes 

app.use('/', indexRouter);
app.use(function(req, res) {
    res.sendStatus(404);
});

module.exports = app;