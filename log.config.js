var log4js = require('log4js');
const path = require('path')
const currentDate = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
log4js.configure({
  appenders: {
    std: { type: "stdout", level: "warn", layout: { type: "basic" } },
    base: { type: "dateFile", filename: path.resolve(__dirname, `logs/${currentDate}/error.log`), encoding: "utf-8" },
    mq: { type: "dateFile", filename: path.resolve(__dirname, `logs/${currentDate}/mq_error.log`), encoding: "utf-8" },
    db: { type: "dateFile", filename: path.resolve(__dirname, `logs/${currentDate}/db_error.log`), encoding: "utf-8" }
  },
  categories: {
    default: { appenders: ["std"], level: "warn" },
    custom: { appenders: ["base"], level: "error" },
    mq: { appenders: ["mq", "std"], level: "error" },
    db: { appenders: ["db", "std"], level: "error" },
  }
});

const logger = log4js.getLogger("custom");
const loggerMQ = log4js.getLogger("mq");
const loggerDB = log4js.getLogger("db");

module.exports = {
  logger,
  loggerMQ,
  loggerDB
}
