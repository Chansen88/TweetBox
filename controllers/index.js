require('./twitter');
require('./spotify');

app.get('/', function(req,res ){
  if (req.query.oauth_token && req.query.oauth_verifier) {
    req.session.oauth_token = req.query.oauth_token;
    req.session.oauth_verifier = req.query.oauth_verifier;
    res.redirect('/api/twittertoken');
  } else {
    res.render('index.html.ejs');
  }
});

app.get('*', function(req, res) {
  res.render('index.html.ejs');
});
