import App from './App';

const app = new App();

// Get keyword from command line
const keyword = process.argv[2];

// Send error message if keyword is undefined
if (keyword === undefined) {
  console.log('Please provide a search keyword. Use the command "npm start keyword"')
} else {
  app.run(keyword);
}

