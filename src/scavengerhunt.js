const _ = require('lodash');

const andybot = require('./andybot');
const utils = require('./utils');

let activities;

const handleScan = require('./scan');

module.exports = async function ScavengerHuntHandler(convo, event, activityName) {

	const userPageId = event.user.id;
	const avaliableActivities = await andybot.avaliableActivities(userPageId);
	const hunt = await andybot.scavengerhunt.getClue(userPageId);

	if (hunt.begin) {
		event.reply('#scavengerhunt-begin', { nextClue: hunt.nextClue, nextClueNumber: hunt.nextClueNumber });	
	} else if (hunt.completed) {
		event.reply('#scavengerhunt-complete');
		event.reply("#more-activities", { activities: _.shuffle(avaliableActivities).slice(0, 9) });
	} else {
		event.reply('#scavengerhunt-continue', { nextClue: hunt.nextClue, nextClueNumber: hunt.nextClueNumber });
	}
};
