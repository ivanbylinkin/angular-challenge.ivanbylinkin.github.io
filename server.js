var serveStatic = require('serve-static');

var express = require('express');
var app = express();

app.use(serveStatic(__dirname)).listen(8080);