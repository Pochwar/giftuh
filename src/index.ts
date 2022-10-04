import App from './App';
require('dotenv').config();

if (
  process.env.TWITTER_CONSUMER_KEY === undefined
  || process.env.TWITTER_CONSUMER_SECRET === undefined
  || process.env.TWITTER_ACCESS_TOKEN_KEY === undefined
  || process.env.TWITTER_ACCESS_TOKEN_SECRET === undefined
) {
  console.log('Please provide Twitter\'s Consumer Key, Consumer Secret, Access Token Key & Access Token Secret in .env file')
} else {
  const app = new App(
    process.env.TWITTER_CONSUMER_KEY,
    process.env.TWITTER_CONSUMER_SECRET,
    process.env.TWITTER_ACCESS_TOKEN_KEY,
    process.env.TWITTER_ACCESS_TOKEN_SECRET
  );

  // Get keyword from command line
  const keyword = process.argv[2];

// Send error message if keyword is undefined
  if (keyword === undefined) {
    console.log('Please provide a search keyword. Use the command "npm start keyword"')
  } else {
    app.run(keyword);
  }
}
