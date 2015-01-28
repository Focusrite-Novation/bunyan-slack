var util = require('util'),
	request = require('request'),
	extend = require('extend.js');

function BunyanSlack(options) {
	options = options || {};
	if (!options.webhook_url) {
		throw new Error("webhook url cannot be null");
	} else {
		this.webhook_url = options.webhook_url;
		this.channel = options.channel;
		this.channel = options.channel || "#general";
		this.icon_url = options.icon_url || "http://www.gravatar.com/avatar/3f5ce68fb8b38a5e08e7abe9ac0a34f1?s=200";
		this.username = options.username || "Bunyan Slack";
		this.customFormatter = options.customFormatter;
	}
}

var nameFromLevel = {
	10 : 'trace',
	20 : 'debug',
	30 : 'info',
	40 : 'warn',
	50 : 'error',
	60 : 'fatal'
};

BunyanSlack.prototype.write = function write(json) {
	var record = JSON.parse(json);
	var message = this.customFormatter ? this.customFormatter(record) : {
		text: util.format("[%s] %s", nameFromLevel[record.level].toUpperCase(), record.msg)
	};

	var base = {
		channel: this.channel,
		username: this.username,
		icon_url: this.icon_url
	};

	message = extend(base, message);

	request({
		method: "POST",
		uri: this.webhook_url,
		body: JSON.stringify(message)
	});
};

module.exports = BunyanSlack;