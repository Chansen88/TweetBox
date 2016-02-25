var twitterAPI = require('node-twitter-api');
var config = require('../env.json')[process.env.NODE_ENV || 'development'];
var twitter = new twitterAPI({
  consumerKey: config.TWITTER_CONSUMER_KEY,
  consumerSecret: config.TWITTER_CONSUMER_SECRET,
  callback: config.TWITTER_CALLBACK,
});

apiRouter.route('/twittertoken')
  .get(function (req, res) {
    twitter.getAccessToken(req.query.oauth_token,
    req.session.requestTokenSecret,
    req.query.oauth_verifier,
    function (error, accessToken, accessTokenSecret, results) {
      if (error) {
        res.redirect('/#/account');
      } else {
        req.session.accessToken = accessToken;
        req.session.accessTokenSecret = accessTokenSecret;
        res.redirect('/#/close');
      }
    });

  });

apiRouter.route('/twitterfetch')
.post(function (req, res) {
  twitter.getTimeline('mentions_timeline', req.body,
  req.session.accessToken, req.session.accessTokenSecret,
  function (error, data, response) {
    if (error) {
      res.json(error);
    } else {
      var results = { lastId: data[0].id, tweets: [] };
      for (var i = 0; i < data.length; i++) {
        results.tweets.push(data[i].text.split(' ').slice(1).join(' '));
      }

      res.json(results);
    }
  });
});

apiRouter.route('/authcheck')
.post(function (req, res) {
  twitter.verifyCredentials(req.session.accessToken,
    req.session.accessTokenSecret, function (error, data, response) {
    if (error) {
      console.error('Twitter login Error' + error);
      res.status(401).json({
              error: true,
              data: { loginStatus: false },
            });
    } else {
      res.status(200).json({
              error: false,
              data: { loginStatus: true },
            });
    }
  });
});

apiRouter.route('/twitterauth')
.get(function (req, res) {
  twitter.getRequestToken(
  function (error, requestToken, requestTokenSecret, results) {
    if (error) {
      console.log('Error getting OAuth request token : ' + error);
    } else {
      req.session.requestToken = requestToken;
      req.session.requestTokenSecret = requestTokenSecret;
      userredirect(requestToken);
    }

    function userredirect(requestToken) {
      res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' +
        requestToken);
    }
  });
});

app.use('/api', apiRouter);
