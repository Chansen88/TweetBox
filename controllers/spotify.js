var twitterAPI = require('node-twitter-api');
var config = require('../env.json')[process.env.NODE_ENV || 'development'];
var myClientId = config.SPOTIFY_CLIENT_ID;
var mySecret = config.SPOTIFY_CLIENT_SECRET;
var redirectUri = 'https://obscure-brushlands-6394.herokuapp.com/spotifycallback';
var scopes = 'user-read-private user-read-email playlist-modify-public playlist-modify-private user-follow-read user-library-read user-library-modify user-read-private user-read-birthdate';

app.get('/spotifyauth', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + myClientId +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(redirectUri));
});

app.get('/spotifycallback', function(req, res) {
  req.session.spotifyToken = req.query.code;
  res.json(req.query.code);
});

app.use('/api', apiRouter);
