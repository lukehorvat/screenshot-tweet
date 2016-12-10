#!/usr/bin/env node

import chalk from "chalk";
import yargs from "yargs";
import pkg from "../package.json";
import screenshotTweet from "./";

const { argv } =
  yargs
  .usage(`Usage: ${chalk.cyan(pkg.name, chalk.underline("TWEET URL"))}`)
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

if (argv._.length !== 1) {
  yargs.showHelp();
  console.error(chalk.red("Tweet URL must be specified."));
  process.exit(1);
}

screenshotTweet(
  argv._[0]
).then(() => {
  console.log(chalk.green("Done!"));
  process.exit();
}).catch(error => {
  console.error(chalk.red("An unexpected error occurred."));
  process.exit(1);
});
