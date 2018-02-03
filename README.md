# screenshot-tweet [![NPM version](http://img.shields.io/npm/v/screenshot-tweet.svg?style=flat-square)](https://www.npmjs.org/package/screenshot-tweet)

Screenshot a Twitter tweet.

![](https://i.imgur.com/dwSuivL.png)

## Installation

Install the package with NPM:

```bash
$ npm install -g screenshot-tweet
```

The `-g` flag is recommended for easy CLI usage, but completely optional.

## API

The package exposes a function with the signature `(tweetUrl, filePath)`, where `tweetUrl` is the URL of the tweet and `filePath` is the filesystem location to save the screenshot at. Returns a Promise.

Example:

```javascript
import screenshotTweet from "screenshot-tweet";

screenshotTweet(
  "https://twitter.com/reactjs/status/912712906407501825",
  "tweet.jpg"
).then(() => {
  console.log("Success");
}).catch(error => {
  console.error("Error");
});
```

## CLI

Execute `screenshot-tweet` from the command line with the following arguments:

```bash
$ screenshot-tweet TWEET_URL FILE_PATH
```

Example:

```bash
$ screenshot-tweet https://twitter.com/reactjs/status/912712906407501825 tweet.jpg
```
