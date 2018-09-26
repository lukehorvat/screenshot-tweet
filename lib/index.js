import Nightmare from "nightmare";
import twitterUrlParser from "twitter-url-parser";

export default function(tweetUrl, filePath) {
  return new Promise((resolve, reject) => {
    const tweetId = (() => {
      try {
        return twitterUrlParser(tweetUrl).id;
      } catch (error) {
        throw new Error('Invalid tweet URL.');
      }
    })();
    const tweetSelector = `.tweet[data-tweet-id="${tweetId}"]`;
    const sensitivityButtonSelector = `${tweetSelector} button.js-display-this-media`;
    const mediaSelector = `${tweetSelector} .AdaptiveMedia`;
    const iframeSelector = `${tweetSelector} iframe`;
    const nightmare = new Nightmare();

    Promise.resolve()
    .then(() => nightmare.viewport(2000, 2000))
    .then(() => nightmare.goto(tweetUrl))
    .then(() => nightmare.wait(() => document.readyState === "complete"))
    .then(() => nightmare.exists(tweetSelector))
    .then(hasTweet => { if (!hasTweet) throw new Error('Tweet does not exist!') })
    .then(() => nightmare.exists(sensitivityButtonSelector))
    .then(hasSensitivityButton => hasSensitivityButton && nightmare.click(sensitivityButtonSelector))
    .then(() => nightmare.exists(mediaSelector))
    .then(hasMedia => hasMedia && nightmare.waitUntilVisible(mediaSelector))
    .then(() => nightmare.exists(iframeSelector))
    .then(hasIframe => hasIframe && nightmare.waitUntilVisible(iframeSelector))
    .then(() => nightmare.style(tweetSelector, { borderRadius: "0px" })) // Ensure tweet completely fills screenshot.
    .then(() => nightmare.boundingBox(tweetSelector))
    .then(boundingBox => nightmare.screenshot(filePath, boundingBox).end())
    .then(resolve)
    .catch(reject);
  });
}

Nightmare.action("waitUntilVisible", function(selector, done) {
  this.wait(selector).then(() => (
    this.wait(selector => {
      const element = document.querySelector(selector);
      return element.offsetWidth > 0 && element.offsetHeight > 0;
    }, selector)
  )).then(done);
});

Nightmare.action("style", function(selector, style, done) {
  this.evaluate_now((selector, style) => {
    const element = document.querySelector(selector);
    Object.assign(element.style, style);
  }, done, selector, style);
});

Nightmare.action("boundingBox", function(selector, done) {
  this.evaluate_now(selector => {
    const element = document.querySelector(selector);
    const rectangle = element.getBoundingClientRect();
    return {
      x: Math.round(rectangle.left),
      y: Math.round(rectangle.top),
      width: Math.round(rectangle.width),
      height: Math.round(rectangle.height),
    };
  }, done, selector);
});
