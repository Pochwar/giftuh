import { ETwitterStreamEvent, TweetStream } from 'twitter-api-v2';
const { TwitterApi } = require('twitter-api-v2');
import download, { DownloadResult } from 'image-downloader';
const mkdirp = require('mkdirp');
import fs from 'fs';

export default class App {
  private twitterClient: any;

  private path!: string;

  constructor(appKey: string, appSecret: string, accessToken: string, accessSecret: string) {
    this.twitterClient = new TwitterApi({ appKey, appSecret, accessToken, accessSecret });
  }

  private setPath(path: string): void {
    this.path = path;
  }

  public run(keyword: string): void {
    this.setPath(`downloaded_images/${keyword}`);
    console.log('###########################################')
    console.log(`# Looking for "${keyword}" images in tweets `)
    console.log('###########################################')

    this.twitterClient.v1.stream.getStream('statuses/filter.json', {track: keyword})
      .then((stream: TweetStream<any>) => {
        stream.on(ETwitterStreamEvent.Data, (event) => {
          const user_id = event.user.id;
          const user_name = event.user.screen_name;
          console.log('########################################')
          console.log(`New result found for keyword: ${keyword}`)
          console.log(`User ID: ${user_id}`)
          console.log(`User name: @${user_name}`)

          if (event && event.entities && event.entities.media) {
            const media_url = event.entities.media[0].media_url;
            const media_id = event.entities.media[0].id_str;
            this.consoleLogYellow('One media found :D')
            this.consoleLogYellow(`URL: ${media_url}`)

            // Set subfolder path where to save images
            const path = `downloaded_images/${keyword}`;

            // Create subfolder if not exist
            mkdirp(`${__dirname}/../${path}`, (err: Error) => {
              if (err) {
                console.error(err)
              } else {
                // Set download options
                const options = {
                  url: media_url,
                  dest: `${__dirname}/../${path}/${media_id}-@${user_name}-(id:${user_id}).jpg`,
                };

                // Save image if new
                if (this.isNew(media_id)) {
                  download.image(options)
                    .then((result: DownloadResult) => {
                      this.consoleLogGreen(`File saved to: ${result.filename}`)
                    })
                    .catch((err: Error) => {
                      console.error(err)
                    })
                } else {
                  this.consoleLogRed("File already exists, download aborted")
                }
              }
            })

          } else {
            console.log('No media found :/')
          }
        })

        stream.on(ETwitterStreamEvent.Error, (error) => {
          console.log(`Error: ${error}`);
        });
      });
  }

  private isNew(media_id: string): boolean {
    let isNew = true;
    fs.readdirSync(this.path).forEach((file: string) => {
      const pattern = new RegExp(/([0-9]*)(-@)(.*)/gm)
      const res = pattern.exec(file)
      if (res && res[1] === media_id) {
        isNew = false;
      }
    })

    return isNew;
  }

  private consoleLogGreen = function(s: string) {
    console.log('\x1b[32m', s, '\x1b[0m')
  };

  private consoleLogRed = function(s: string) {
    console.log('\x1b[31m', s, '\x1b[0m')
  };

  private consoleLogYellow = function(s: string) {
    console.log('\x1b[33m', s, '\x1b[0m')
  };
}
