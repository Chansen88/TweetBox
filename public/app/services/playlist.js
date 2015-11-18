(function() {
  angular
    .module('tweetBoxApp')
    .factory('Playlist', ['$http', 'Spotify', '$sce',
      function($http, Spotify, $sce) {
      var Playlist = {};
      Playlist.trackData = [];
      Playlist.parsedTrack = [];

      function Track(data, main) {
        this.id = data[0].id;
        this.name = data[0].name;
        var tempArtists = [];
        data[0].artists.forEach(function(artist) {
          tempArtists.push(artist.name);
        });
        this.artists = tempArtists.join(', ');
        this.album = data[0].album.name;
        this.albumArt = data[0].album.images[1].url;
        if (main) {
          this.score = 0;
          this.time = Date.now();
          this.subtracks = [];
          this.subtracks.push(new Track([data[1]], false));
          this.subtracks.push(new Track([data[2]], false));
          this.subtracks.push(new Track([data[3]], false));
          this.subtracks.push(new Track([data[4]], false));
        }
      };

      Playlist.parsedTrack = [false];

      Playlist.new = function() {
        Playlist.parsedTrack.length = 0;
        Playlist.trackData.length = 0;
      };

      Playlist.intake = function(songs) {
        console.log(songs);
        for (var i = songs.length - 1; i >= 0; i--) {
          Playlist.add(songs[i]);
        }
      };

      Playlist.add = function(song) {
        Spotify.searchAll(song).then(function(data) {
          console.log(data.tracks.items[0]);
          if (data.tracks.items[0]) {
            var temp = _.find(
              Playlist.trackData, _.matchesProperty(
                'id', data.tracks.items[0].id
              )
            );
            if (temp) {
              temp.score ++;
            } else {
              Playlist.trackData.push(
                new Track(data.tracks.items.slice(0, 5), true)
              );
            }
            Playlist.sort();
          }
        });
      };


      Playlist.addSearch = function(songdata) {
        if (songdata[0]) {
          var temp = _.find(
            Playlist.trackData, _.matchesProperty(
              'id', songdata[0].id
            )
          );
          if (temp) {
            temp.score ++;
          } else {
            var newTrack = new Track(songdata, false);
            newTrack.score = 0;
            newTrack.time = Date.now();
            Playlist.trackData.push(newTrack);
          }
          Playlist.sort();
        };
      };


      Playlist.remove = function(track) {
        _.difference(Playlist.trackData, track);
        Playlist.sort();
      };


      Playlist.buildUrl = function() {
        var trackId = [];
        Playlist.trackData.forEach(function(track) {
          trackId.push(track.id);
        });
        Playlist.parsedTrack[0] = $sce.trustAsResourceUrl(
          'https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:' +
          trackId.join(','));
      };
      Playlist.sub = function(trackOne, trackTwo) {
        var temp = {};
        temp.id = trackOne.id;
        temp.name = trackOne.name;
        temp.artists = trackOne.artists;
        temp.album = trackOne.album;

        trackOne.id = trackTwo.id;
        trackOne.name = trackTwo.name;
        trackOne.artists = trackTwo.artists;
        trackOne.album = trackTwo.album;

        trackTwo.id = temp.id;
        trackTwo.name = temp.name;
        trackTwo.artists = temp.artists;
        trackTwo.album = temp.album;

        Playlist.buildUrl();
      };

      Playlist.sort = function() {
        Playlist.trackData.sort(compare);
        function compare(a, b) {
          if (a.score > b.score) {
            return -1;
          } else if (a.score < b.score) {
            return 1;
          }
          if (a.time > b.time) {
            return 1;
          } else {
            return -1;
          }
        }
        Playlist.buildUrl();
      };

      Playlist.scoreChange = function(track, adj) {
        track.score += adj;
        Playlist.sort();
      };

      Playlist.remove = function(track) {
        _.remove(Playlist.trackData, track);
        Playlist.sort();
      };

      return Playlist;
    }]);
})();
