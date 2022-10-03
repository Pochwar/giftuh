require('dotenv').config()
const Twitter = require('twitter');
const download = require('image-downloader');
const mkdirp = require('mkdirp');
const fs = require('fs');

// Set twitter client
const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

// Get keyword from command line
const keyword = process.argv[2];

// Colored console log
const consoleLogYellow = function(string) {
  console.log('\x1b[33m', string, '\x1b[0m')
};
const consoleLogRed = function(string) {
  console.log('\x1b[31m', string, '\x1b[0m')
};
const consoleLogGreen = function(string) {
  console.log('\x1b[32m', string, '\x1b[0m')
};


// Check if file is new
const isNew = function(media_id, path) {
  fs.readdirSync(path).forEach(file => {
    var pattern = new RegExp(/([0-9]*)(-@)(.*)/gm)
    var res = pattern.exec(file)
    if (res[1] === media_id) {
      return false;
    }
  })
  return true;
};

// Send error message if keyword is undefined
if (keyword === undefined) {
  console.log('Please provide a search keyword. Use the command "npm start keyword"')
}

// Start search
else {
  console.log('###########################################')
  console.log(`# Looking for "${keyword}" images in tweets `)
  console.log('###########################################')

  client.stream('statuses/filter', {track: keyword}, function(stream) {
    stream.on('data', function(event) {
      const user_id = event.user.id;
      const user_name = event.user.screen_name;
      console.log('########################################')
      console.log(`New result found for keyword: ${keyword}`)
      console.log(`User ID: ${user_id}`)
      console.log(`User name: @${user_name}`)

      if (event && event.entities && event.entities.media) {
        const media_url = event.entities.media[0].media_url;
        const media_id = event.entities.media[0].id_str;
        consoleLogYellow('One media found :D')
        consoleLogYellow(`URL: ${media_url}`)

        // Set subfolder path where to save images
        const path = `./downloaded_images/${keyword}`;

        // Create subfolder if not exist
        mkdirp(path, function(err) {
          if (err) {
            console.error(err)
          } else {
            // Set download options
            const options = {
              url: media_url,
              dest: `${path}/${media_id}-@${user_name}-(id:${user_id}).jpg`,
            };

            // Save image if new
            if (isNew(media_id, path)) {
              download.image(options)
                .then(({ filename, image }) => {
                  consoleLogGreen(`File saved to: ${filename}`)
                })
                .catch((err) => {
                  console.error(err)
                })
            } else {
              consoleLogRed("File already exists, download aborted")
            }
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
