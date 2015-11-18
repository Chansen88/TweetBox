var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('cookie-session');
var db = require('./models');
var config = require('./env.json')[process.env.NODE_ENV || 'production'];

apiRouter = express.Router();
app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.static(__dirname + '/app'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods',
    'GET, POST, DELETE, PUT, PATCH');
  res.setHeader('Access-Control-Allow-Headers',
    'X-Requested-With,content-type, Authorization');
  next();
});

app.use(session({
  maxAge: 36000000,
  secret: 'hurhurhurhur',
  name: 'TweetBox'
}));

require('./controllers/index');

app.get('*', function(req, res) {
  res.render('index.html.ejs');
});

app.listen(process.env.PORT || 3000, function() {
  console.log('server is listening on port ' + process.env.PORT || 3000);
});
