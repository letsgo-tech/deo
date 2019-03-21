const log4js = require('log4js');
const fs = require('fs');
const path = require('path');

log4js.configure({
	appenders: {
	  everything: { type: 'dateFile', filename: 'log/deo.log', pattern: '.yyyy-MM-dd-hh', compress: true }
	},
	categories: {
	  default: { appenders: [ 'everything' ], level: 'all'}
	}
  });

exports.logger = function (name) {
    const logger = log4js.getLogger(name);
    return logger;
};