"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var twitter_api_v2_1 = require("twitter-api-v2");
var TwitterApi = require('twitter-api-v2').TwitterApi;
var image_downloader_1 = __importDefault(require("image-downloader"));
var mkdirp = require('mkdirp');
var fs_1 = __importDefault(require("fs"));
var App = /** @class */ (function () {
    function App(appKey, appSecret, accessToken, accessSecret) {
        this.consoleLogGreen = function (s) {
            console.log('\x1b[32m', s, '\x1b[0m');
        };
        this.consoleLogRed = function (s) {
            console.log('\x1b[31m', s, '\x1b[0m');
        };
        this.consoleLogYellow = function (s) {
            console.log('\x1b[33m', s, '\x1b[0m');
        };
        this.twitterClient = new TwitterApi({ appKey: appKey, appSecret: appSecret, accessToken: accessToken, accessSecret: accessSecret });
    }
    App.prototype.setPath = function (path) {
        this.path = path;
    };
    App.prototype.run = function (keyword) {
        var _this = this;
        this.setPath("downloaded_images/".concat(keyword));
        console.log('###########################################');
        console.log("# Looking for \"".concat(keyword, "\" images in tweets "));
        console.log('###########################################');
        this.twitterClient.v1.stream.getStream('statuses/filter.json', { track: keyword })
            .then(function (stream) {
            stream.on(twitter_api_v2_1.ETwitterStreamEvent.Data, function (event) {
                var user_id = event.user.id;
                var user_name = event.user.screen_name;
                console.log('########################################');
                console.log("New result found for keyword: ".concat(keyword));
                console.log("User ID: ".concat(user_id));
                console.log("User name: @".concat(user_name));
                if (event && event.entities && event.entities.media) {
                    var media_url_1 = event.entities.media[0].media_url;
                    var media_id_1 = event.entities.media[0].id_str;
                    _this.consoleLogYellow('One media found :D');
                    _this.consoleLogYellow("URL: ".concat(media_url_1));
                    // Set subfolder path where to save images
                    var path_1 = "downloaded_images/".concat(keyword);
                    // Create subfolder if not exist
                    mkdirp("".concat(__dirname, "/../").concat(path_1), function (err) {
                        if (err) {
                            console.error(err);
                        }
                        else {
                            // Set download options
                            var options = {
                                url: media_url_1,
                                dest: "".concat(__dirname, "/../").concat(path_1, "/").concat(media_id_1, "-@").concat(user_name, "-(id:").concat(user_id, ").jpg"),
                            };
                            // Save image if new
                            if (_this.isNew(media_id_1)) {
                                image_downloader_1.default.image(options)
                                    .then(function (result) {
                                    _this.consoleLogGreen("File saved to: ".concat(result.filename));
                                })
                                    .catch(function (err) {
                                    console.error(err);
                                });
                            }
                            else {
                                _this.consoleLogRed("File already exists, download aborted");
                            }
                        }
                    });
                }
                else {
                    console.log('No media found :/');
                }
            });
            stream.on(twitter_api_v2_1.ETwitterStreamEvent.Error, function (error) {
                console.log("Error: ".concat(error));
            });
        });
    };
    App.prototype.isNew = function (media_id) {
        var isNew = true;
        fs_1.default.readdirSync(this.path).forEach(function (file) {
            var pattern = new RegExp(/([0-9]*)(-@)(.*)/gm);
            var res = pattern.exec(file);
            if (res && res[1] === media_id) {
                isNew = false;
            }
        });
        return isNew;
    };
    return App;
}());
exports.default = App;
