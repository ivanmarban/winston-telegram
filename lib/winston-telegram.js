/*
 * winston-telegram.js: Transport for outputting logs to Telegram
 *
 * (C) 2015 Ivan Marban
 * MIT LICENCE
 */

var util	= require('util');
var request	= require('request');
var winston	= require('winston');

/**
 * @constructs 
 * @param {object} options
 * @param {String} options.token Telegram bot authentication token
 * @param {String} options.chatid Telegram unique identifier for chat
 */
var Telegram = exports.Telegram = function (options) {
	options = options || {};
	if (!options.token || !options.chatid){
		throw new Error('winston-telegram requires \'token\' and \'chatid\' property');
	}
	this.token  = options.token;
	this.chatid = options.chatid;
	this.level = options.level || 'info';
	this.unique = options.unique || false;
	this.silent = options.silent || false;
};

/** @extends winston.Transport */
util.inherits(Telegram, winston.Transport);

/**
 * Define a getter so that `winston.transports.Telegram`
 * is available and thus backwards compatible.
 */
winston.transports.Telegram = Telegram;

/**
 * Core logging method exposed to Winston.
 * @function log
 * @member Telegram
 * @param level {string} Level at which to log the message
 * @param msg {string} Message to log
 * @param meta {Object} **Optional** Additional metadata to attach
 * @param callback {function} Continuation to respond to when complete.
 */
Telegram.prototype.log = function (level, msg, meta, callback) {
	var self = this;
	if (this.silent) return callback(null, true);
	if (this.unique && this.level != level) return callback(null, true);
	
	request({
		url : 'https://api.telegram.org/bot'+this.token+'/sendMessage',
		method : 'POST',
		json : {
			chat_id : this.chatid,
			text : '['+level+'] '+msg
		}
	}, function(error, response, body){
		if (error) {
			self.emit('error', error);
		}
		if (response && response.statusCode != 200) {
			self.emit('error', response.statusCode);
		}
		self.emit('logged');
		callback(null, true);
	});
};