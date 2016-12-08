

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var hbsutils = require('hbs-utils')(hbs);


/* Routes*/
var routes = require('./routes/index');
var login = require('./routes/login');
var logout = require('./routes/logout');
var project = require('./routes/project');
var domains = require('./routes/domains');
var formProcess = require('./routes/processHandler');
var recommendations = require('./routes/recommendations');

var app = express();

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

hbs.localsAsTemplateData(app); // locals variable (app.locals.foo = 'bar')  accessed by using {{@foo}}
hbsutils.registerWatchedPartials(__dirname + '/views/partials');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//# Session store settings
app.use(session({
  store: new FileStore,
  secret: 'my awesome secret',
  resave: true,
  saveUninitialized: true
}));


app.use('/home', routes);
app.use('/login', login);
app.use('/logout', logout);
app.use('/projects', project);
app.use('/domains', domains);
app.use('/process', formProcess);
app.use('/recommendations', recommendations);

// app.use('/', function(req, res) {
//   res.redirect('/login');
//   // next();
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});



/// error handlers

// development error handler
// will print stacktrace

// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err,
//             title: 'error'
//         });
//     });
// }
//
// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {},
//         title: 'error'
//     });
// });


module.exports = app;
