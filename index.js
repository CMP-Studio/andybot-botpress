const postbacks = require('./src/postbacks');
const andybot = require('./src/andybot');
const activities = require('./src/activities.json');

const TriviaHandler = require('./src/trivia');
const ScavengerHuntHandler = require('./src/scavengerhunt');
const utils = require('./utils');
const config = require('./src/config');
const activityHandlers = {
	trivia: TriviaHandler,
	scavengerhunt: ScavengerHuntHandler
};

const _ = require('lodash');

const handleScan = require('./src/scan');

let eventHandlers = {};

let getStarted;

module.exports = function (bp) {

	// Catch get started button press
	// As well as any codes scanned
	async function getStarted(event, next) {
		try {
			event.reply('#vacation');
		} catch (err){
			console.error(err);
			event.reply('#error');
		}
	}

	bp.fallbackHandler = (event, next) => {
	    if (/text|message/i.test(event.type)) {
	      event.reply('#vacation');
	    }
	  }

};


module.exports.eventHandlers = eventHandlers;
