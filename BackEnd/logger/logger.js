const {format, createLogger, transports} = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const {timestamp,combine}=format

const compressFile = require('./compress-file.js');

const transport = new transports.DailyRotateFile({
    level: 'info',
    filename: 'information-%DATE%.log',
    dirname:'./logging/',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,    
    maxSize: '20m',
    maxFiles: '7d'
    });

const transport2 = new transports.DailyRotateFile({
    level: 'error',
    filename: 'error-%DATE%.log',
    dirname:'./logging/',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '7d'
    });

transport.on('rotate', function(oldFilename, newFilename) {
    logger.info(`The log file has rotated from ${oldFilename} to ${newFilename}.`);
    compressFile(oldFilename, (err, data) => {
        if (err) {
            logger.error(`Error compressing file: ${err}`);
            return;
        }

        const archivedFilename = oldFilename + ".gz";
        fs.writeFile(archivedFilename, data, function (err) {
            if (err) {
                logger.error(`Error writing file: ${err}`);
                return;
            }
            logger.info(`Successfully archived ${oldFilename} as ${archivedFilename}.`);
        });
    });
});

transport2.on('rotate', function(oldFilename, newFilename) {
    logger.info(`The log file has rotated from ${oldFilename} to ${newFilename}.`);
    compressFile(oldFilename, (err, data) => {
        if (err) {
            logger.error(`Error compressing file: ${err}`);
            return;
        }

        const archivedFilename = oldFilename + ".gz";
        fs.writeFile(archivedFilename, data, function (err) {
            if (err) {
                logger.error(`Error writing file: ${err}`);
                return;
            }
            logger.info(`Successfully archived ${oldFilename} as ${archivedFilename}.`);
        });
    });
});

const logger = createLogger({
    level: 'info',
    format: combine(timestamp(),format.json()),
    defaultMeta: { service: 'user-service' },   
    transports: [
        transport
    ]
});


module.exports = logger;