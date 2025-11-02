import pino from "pino";

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
      singleLine: false,
      hideObject: false,
    },
  },
});

console.log = (...args) => logger.info(args.length === 1 ? args[0] : args);
console.info = (...args) => logger.info(args.length === 1 ? args[0] : args);
console.warn = (...args) => logger.warn(args.length === 1 ? args[0] : args);
console.error = (...args) => logger.error(args.length === 1 ? args[0] : args);
console.debug = (...args) => logger.debug(args.length === 1 ? args[0] : args);
