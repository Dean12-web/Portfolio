var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash')
var fileUpload = require('express-fileupload')
var session = require('express-session')
const {Pool} = require('pg')

const pool = new Pool({
  user: 'Dean12',
  host: 'localhost',
  database: 'portfoliodb',
  password: '12345',
  port: 5432
})

var indexRouter = require('./routes/index')(pool);
var usersRouter = require('./routes/users')(pool);
var postsRouter = require('./routes/posts')(pool);
var adminRouter = require('./routes/admin')(pool);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(fileUpload())
app.use(flash())
app.use(session({
  secret: 'deanweb',
  resave:false,
  saveUninitialized:true
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
