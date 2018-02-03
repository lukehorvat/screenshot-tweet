import Nightmare from "nightmare";
import twitterUrlParser from "twitter-url-parser";

export default function(tweetUrl, filePath) {
  let tweetId = twitterUrlParser(tweetUrl).id;
  let tweetSelector = `.tweet[data-tweet-id="${tweetId}"]`;
  let sensitiveMediaSelector = `${tweetSelector} button.js-display-this-media`;
  let nightmare = new Nightmare();

  return Promise.resolve()
  .then(() => nightmare.viewport(2000, 2000))
  .then(() => nightmare.goto(tweetUrl))
  .then(() => nightmare.wait(tweetSelector))
  .then(() => nightmare.exists(sensitiveMediaSelector))
  .then(isSensitive => isSensitive && nightmare.click(sensitiveMediaSelector).wait(1000))
  .then(() => (
    nightmare.evaluate(tweetSelector => {
      let tweet = document.querySelector(tweetSelector);
      tweet.style.borderRadius = "0px"; // Ensure that the tweet completely fills the screenshot rectangle.

      let rectangle = tweet.getBoundingClientRect();
      return {
        x: Math.round(rectangle.left),
        y: Math.round(rectangle.top),
        width: Math.round(rectangle.width),
        height: Math.round(rectangle.height)
      };
    }, tweetSelector)
  ))
  .then(rectangle => nightmare.screenshot(filePath, rectangle))
  .then(() => nightmare.end());
}
