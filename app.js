require('dotenv').config()
var Twitter = require('twitter');
var download = require('image-downloader')

var client = new Twitter({
  consumer_key:process.env.TWITTER_CONSUMER_KEY,
  consumer_secret:process.env.TWITTER_CONSUMER_SECRET,
  access_token_key:process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret:process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var keyword = process.env.SEARCHED_KEYWORD

client.stream('statuses/filter', {track: keyword}, function(stream) {
  stream.on('data', function(event) {
    console.log('########################################')
    console.log(`New result found for keyword: ${keyword}`)

    if (event && event.entities && event.entities.media) {
      var media_url = event.entities.media[0].media_url
      console.log('One media found :D')
      console.log(`URL: ${media_url}`)

      var options = {
        url: media_url,
        dest: './downloaded_images'
      }

      download.image(options)
        .then(({ filename, image }) => {
          console.log(`File saved to: ${filename}`)
        })
        .catch((err) => {
          console.error(err)
        })

    } else {
      console.log('No media found :/')
    }
  });

  stream.on('error', function(error) {
    console.log(`Error: ${error}`);
  });
});