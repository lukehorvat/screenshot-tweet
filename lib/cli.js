#!/usr/bin/env node

import chalk from "chalk";
import yargs from "yargs";
import twitterUrlParser from "twitter-url-parser";
import tildify from "tildify";
import pkg from "../package.json";
import screenshotTweet from "./";

const { argv } =
  yargs
  .usage(`Usage: ${chalk.cyan(pkg.name, chalk.underline("TWEET URL"), chalk.underline("FILE PATH"))}`)
  .option("h", { alias: "help", describe: "Show help", type: "boolean" })
  .option("v", { alias: "version", describe: "Show version", type: "boolean" });

if (argv.help || argv.h) {
  yargs.showHelp();
  process.exit();
}

if (argv.version || argv.v) {
  console.log(pkg.version);
  process.exit();
}

if (argv._.length !== 2) {
  yargs.showHelp();
  console.error(chalk.red("Tweet URL and file path must be specified."));
  process.exit(1);
}

let [ tweetUrl, filePath ] = argv._;
console.log(chalk.green(`Screenshotting tweet "${twitterUrlParser(tweetUrl).id}" to "${tildify(filePath)}"...`));

screenshotTweet(
  tweetUrl,
  filePath
).then(() => {
  console.log(chalk.green("Done!"));
  process.exit();
}).catch(error => {
  console.error(chalk.red(error));
  process.exit(1);
});
