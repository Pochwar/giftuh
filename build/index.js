"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var App_1 = __importDefault(require("./App"));
var app = new App_1.default();
// Get keyword from command line
var keyword = process.argv[2];
// Send error message if keyword is undefined
if (keyword === undefined) {
    console.log('Please provide a search keyword. Use the command "npm start keyword"');
}
else {
    app.run(keyword);
}
