import Nightmare from "nightmare";
import twitterUrlParser from "twitter-url-parser";

export default function(tweetUrl, filePath) {
  let tweetId = twitterUrlParser(tweetUrl).id;
  let tweetSelector = `.tweet[data-tweet-id="${tweetId}"]`;
  let sensitivityButtonSelector = `${tweetSelector} button.js-display-this-media`;
  let mediaSelector = `${tweetSelector} .AdaptiveMedia`;
  let nightmare = new Nightmare();

  return Promise.resolve()
  .then(() => nightmare.viewport(2000, 2000))
  .then(() => nightmare.goto(tweetUrl))
  .then(() => nightmare.wait(() => document.readyState === "complete"))
  .then(() => nightmare.exists(sensitivityButtonSelector))
  .then(hasSensitivityButton => hasSensitivityButton && nightmare.click(sensitivityButtonSelector))
  .then(() => nightmare.exists(mediaSelector))
  .then(hasMedia => hasMedia && nightmare.waitUntilVisible(mediaSelector))
  .then(() => nightmare.style(tweetSelector, { borderRadius: "0px" })) // Ensure tweet completely fills screenshot.
  .then(() => nightmare.boundingBox(tweetSelector))
  .then(boundingBox => nightmare.screenshot(filePath, boundingBox))
  .then(() => nightmare.end());
}

Nightmare.action("waitUntilVisible", function(selector, done) {
  this.wait(selector).then(() => (
    this.wait(selector => {
      let element = document.querySelector(selector);
      return element.offsetWidth > 0 && element.offsetHeight > 0;
    }, selector)
  )).then(done);
});

Nightmare.action("style", function(selector, style, done) {
  this.evaluate_now((selector, style) => {
    let element = document.querySelector(selector);
    Object.assign(element.style, style);
  }, done, selector, style);
});

Nightmare.action("boundingBox", function(selector, done) {
  this.evaluate_now(selector => {
    let element = document.querySelector(selector);
    let rectangle = element.getBoundingClientRect();
    return {
      x: Math.round(rectangle.left),
      y: Math.round(rectangle.top),
      width: Math.round(rectangle.width),
      height: Math.round(rectangle.height),
    };
  }, done, selector);
});
