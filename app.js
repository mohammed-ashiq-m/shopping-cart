var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let expressHBS= require('express-handlebars');
let session=require('express-session');
let passport=require('passport');
let flash=require('connect-flash');

let db=require('./dbconfig/db-connect');


var indexRouter = require('./routes/index');

let userRouter=require('./routes/user');
var app = express();

// view engine setup
app.engine('.hbs',expressHBS({defaultLayout: 'layout',extname:'.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret:'mysecret',resave:false,saveUninitialized:false}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req,res,next) {
  res.locals.login=req.isAuthenticated();
  next();
})

app.use('/', indexRouter);
app.use('/user',userRouter);
//app.use('/user/signup',indexRouter);


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

db.connect(function (error) {

  if (error){
    console.log('Unable to connect database');
    process.exit(1);
  } else {
    console.log('Shopping cart Database connecetd successfully...');
  }

});

module.exports = app;