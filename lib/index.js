import Nightmare from "nightmare";
import twitterUrlParser from "twitter-url-parser";

export default function(tweetUrl, filePath) {
  let tweetId = twitterUrlParser(tweetUrl).id;
  let tweetSelector = `.tweet[data-tweet-id="${tweetId}"]`;
  let nightmare = new Nightmare();

  return Promise.resolve()
  .then(() => nightmare.viewport(2000, 2000))
  .then(() => nightmare.goto(tweetUrl))
  .then(() => nightmare.wait(tweetSelector))
  .then(() => (
    nightmare.evaluate(tweetSelector => {
      let rectangle = document.querySelector(tweetSelector).getBoundingClientRect();
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
