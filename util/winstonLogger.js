var appRoot = require('app-root-path');
var winston = require('winston');


const myformat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(), //adds a \t before message
  winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`) //to customized message
);


var options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880,
    maxFiles: 1,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    format:myformat,
  },
};


var logger = new winston.createLogger({
  transports: [
    
  ],
  // exceptionHandlers: [
  //   new winston.transports.File({ filename: `${appRoot}/logs/exceptions.log` })
  // ],
  exitOnError: false,
});

if(process.env.HAS_LOCAL_STORAGE === 'TRUE'){
  logger.add(new winston.transports.File(options.file));
}

if(process.env.NODE_ENV !== 'production'){
  logger.add(new winston.transports.Console(options.console));
}

module.exports=logger;