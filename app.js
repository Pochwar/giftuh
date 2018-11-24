require('dotenv').config()
var Twitter = require('twitter');
var download = require('image-downloader')
var mkdirp = require('mkdirp')

// Set twitter client
var client = new Twitter({
  consumer_key:process.env.TWITTER_CONSUMER_KEY,
  consumer_secret:process.env.TWITTER_CONSUMER_SECRET,
  access_token_key:process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret:process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// Get keyword from command line
var keyword = process.argv[2]

// Send error message if keyword is undefined
if (keyword == undefined) {
  console.log('Please provide a search keyword. Use the command "npm start keyword"')
}

// Start search
else {
  console.log('########################################')
  console.log(`# Looking for "${keyword}" images`)
  console.log('########################################')

  client.stream('statuses/filter', {track: keyword}, function(stream) {
    stream.on('data', function(event) {
      var user_id = event.user.id
      var user_name = event.user.screen_name
      console.log('########################################')
      console.log(`New result found for keyword: ${keyword}`)
      console.log(`User ID: ${user_id}`)
      console.log(`User name: @${user_name}`)

      if (event && event.entities && event.entities.media) {
        var media_url = event.entities.media[0].media_url
        var media_id = event.entities.media[0].id_str
        console.log('One media found :D')
        console.log(`URL: ${media_url}`)

        // Set subfolder path where to save images
        var path = `./downloaded_images/${keyword}`

        // Create subfolder if not exist
        mkdirp(path, function(err) {
          if (err) {
            console.error(err)
          } else {
            // Set download options
            var options = {
              url: media_url,
              dest: `${path}/${media_id}-@${user_name}-(id:${user_id}).jpg`
            }

            // Save image
            download.image(options)
              .then(({ filename, image }) => {
                console.log(`File saved to: ${filename}`)
              })
              .catch((err) => {
                console.error(err)
              })
          }
        })

      } else {
        console.log('No media found :/')
      }
    });

    stream.on('error', function(error) {
      console.log(`Error: ${error}`);
    });
  });
}