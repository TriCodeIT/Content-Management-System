var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dataRouter = require('./routes/datas');
var dataDateRouter = require('./routes/datadates');
var mapsRouter = require('./routes/maps');

mongoose.connect('mongodb://localhost/cmsdb', {useNewUrlParser: true, useUnifiedTopology: true});
console.log('Connected Database Integration MongoDB');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/data', dataRouter);
app.use('/api/datadates', dataDateRouter);
app.use('/api/maps', mapsRouter);

module.exports = app;
