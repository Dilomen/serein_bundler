var log4js = require('log4js');
const path = require('path')
const currentDate = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
log4js.configure({
  appenders: {
    std: { type: "stdout", level: "warn", layout: { type: "basic" } },
    base: { type: "dateFile", filename: path.resolve(__dirname, `logs/${currentDate}/error.log`), encoding: "utf-8" },
  },
  categories: {
    default: { appenders: ["std"], level: "warn" },
    custom: { appenders: ["base"], level: "error" }
  }
});

const logger = log4js.getLogger("custom");

module.exports = {
  logger
}
