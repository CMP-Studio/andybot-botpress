const _ = require('lodash');

const andybot = require('./andybot');
const utils = require('./utils');

let activities;

const handleScan = require('./scan');

module.exports = async function ScavengerHuntHandler(convo, event, activityName) {

	if (utils.isNull(activities)) {
		activities = require('./activities.json');
	}

	const userPageId = event.user.id;
	const activity = activities[activityName];
	const activityTitle = _.find(activities.activities, (e) => e.activity === activityName).title;
	if ( utils.isNull(activity)){
		// return 
		
	}

	event.reply('#scavengerhunt-time');	
};
