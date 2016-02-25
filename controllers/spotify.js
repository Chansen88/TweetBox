var twitterAPI = require('node-twitter-api');
var SpotifyWebApi = require('spotify-web-api-node');
var config = require('../env.json')[process.env.NODE_ENV || 'development'];
var myClientId = config.SPOTIFY_CLIENT_ID;
var mySecret = config.SPOTIFY_CLIENT_SECRET;
var redirectUri = config.SPOTIFY_CALLBACK;
var scopes = 'user-read-private user-read-email playlist-modify-public playlist-modify-private user-follow-read user-library-read user-library-modify user-read-private user-read-birthdate';
var spotifyApi = new SpotifyWebApi({
  clientId: myClientId,
  clientSecret: mySecret,
  redirectUri: redirectUri,
});

apiRouter.route('/spotifyauth')
.get(function (req, res) {
  res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + myClientId +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(redirectUri));
});

apiRouter.route('/spotifycallback')
.get(function (req, res) {
  if (req.query.code) {
    var code = req.query.code;
    spotifyApi.authorizationCodeGrant(code)
   .then(function (data) {
     req.session.spotifyToken = data.body.access_token;
     res.redirect('/#/close');
   }, function (err) {

     console.log('Something went wrong!', err);
   });
  }
});

apiRouter.route('/spotifyToken')
.get(function (req, res) {
  res.json(req.session.spotifyToken);
});

app.use('/api', apiRouter);
