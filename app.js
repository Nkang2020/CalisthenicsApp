var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var Calisthenics = require('./models/calisthenics');
var User = require('./models/user');
var Comment = require('./models/comment');
var flash = require('connect-flash');
var app = express();

var calisthenicsRoutes = require('./routes/calisthenics');
var indexRoutes = require('./routes/index');
var commentRoutes = require('./routes/comments');

mongoose.connect(process.env.DATABASEURL);
//mongoose.connect('mongodb://localhost/calisthenics_app');


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(flash());


//passport configuration
app.use(require("express-session")({
    secret: 'God Loves Ugly',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash('error');
   res.locals.success = req.flash('success');
   next();
});

app.use('/', calisthenicsRoutes);
app.use('/', indexRoutes);
app.use('/', commentRoutes);

app.listen(process.env.PORT||3000,process.env.IP,function(){
	console.log('Calisthenics Server Started.')
})