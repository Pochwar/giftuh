"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var App_1 = __importDefault(require("./App"));
require('dotenv').config();
if (process.env.TWITTER_CONSUMER_KEY === undefined
    || process.env.TWITTER_CONSUMER_SECRET === undefined
    || process.env.TWITTER_ACCESS_TOKEN_KEY === undefined
    || process.env.TWITTER_ACCESS_TOKEN_SECRET === undefined) {
    console.log('Please provide Twitter\'s Consumer Key, Consumer Secret, Access Token Key & Access Token Secret in .env file');
}
else {
    var app = new App_1.default(process.env.TWITTER_CONSUMER_KEY, process.env.TWITTER_CONSUMER_SECRET, process.env.TWITTER_ACCESS_TOKEN_KEY, process.env.TWITTER_ACCESS_TOKEN_SECRET);
    // Get keyword from command line
    var keyword = process.argv[2];
    // Send error message if keyword is undefined
    if (keyword === undefined) {
        console.log('Please provide a search keyword. Use the command "npm start keyword"');
    }
    else {
        app.run(keyword);
    }
}
