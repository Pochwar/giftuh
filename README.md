# GIFTUH
Get Images From Tweets Using Hashtag

## Description
This project is about to get images from tweets that contains a specific keyword or hashtag. Images will be downloaded into the `downloaded_images` folder.

# Prerequires

- NodeJs
- NPM

## Installation, configuration & usage

- Clone project: `git clone https://github.com/Pochwar/giftuh.git`
- Go inside project: `cd GIFTUH`
- Install dependencies: `npm install`
- Copy `.env.example` file in `.env` file: `cp .env.example .env`
- Set your Twitter's Consumer Key, Consumer Secret, Access Token Key & Access Token Secret in the `.env` file (To create some, go to: https://developer.twitter.com/. You need to have a Twitter account)
- Run the script: `npm start keyword` where "keyword" is the searched term
- Watch the magic happend and get the retrieved images in a specific subfolder of `downloaded_images` folder.

## Development
Use `npm run start:dev` to start nodemon and reload automatically.

Build with `npm run build`
