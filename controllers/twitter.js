var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
  consumerKey: 'e0jOhuIEDqPGk4rkKbmBqqg3O',
  consumerSecret: 'ifxEM2BFTkUoggios041EXYDjrOR21y67GeHPzgTLfxqcO5MZy',
  callback: 'http://127.0.0.1:3000'
});

apiRouter.route('/twittertoken')
  .get(function(req, res) {
    twitter.getAccessToken(req.session.requestToken, req.session.requestTokenSecret, req.session.oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
      if (error) {
        console.log(error);
        console.log('&&&&&&&&&&&&&&&&OSHIT&&&&&&&&&&&&&&&');
        res.redirect('/#/account');
      } else {
        req.session.accessToken = accessToken;
        req.session.accessTokenSecret = accessTokenSecret;
        console.log('##################SUCESS###################');
        res.redirect('/#/account');
      }
    });
  });

apiRouter.route('/twitterfetch')
.post(function(req, res) {
  console.log('controller test');
  console.log(req.body);
  twitter.getTimeline('mentions_timeline', req.body,
  req.session.accessToken, req.session.accessTokenSecret,
  function(error, data, response) {
    if (error) {
      res.json(error);
    } else {
      var results = {lastId: data[0].id, tweets: []};
      for (var i = 0; i < data.length; i++) {
        results.tweets.push(data[i].text);
      }
      res.json(results);
    }
  });
});

app.get('/twitterauth', function(req, res) {
  twitter.getRequestToken(
  function(error, requestToken, requestTokenSecret, results){
    if (error) {
      console.log("Error getting OAuth request token : " + error);
    } else {
      req.session.requestToken = requestToken;
      req.session.requestTokenSecret = requestTokenSecret;
      console.log(req.session.requestToken + " " + req.session.requestTokenSecret);
      userredirect(requestToken);
    }
    function userredirect(requestToken) {
      res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + requestToken);
    }
  });
});

app.use('/api', apiRouter);
