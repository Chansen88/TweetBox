var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('cookie-session');
var db = require('./models');

app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.static(__dirname + '/app'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.use(session({
  maxAge: 36000000,
  secret: 'hurhurhurhur',
  name: 'TweetBox'
}));

require('./controllers/index');

app.listen(3000, function() {
  console.log('Server up @ ' +  3000);
});
