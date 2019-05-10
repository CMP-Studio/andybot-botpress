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

	function isValidActivityType(activityType) {
		const validActivityTypes = ['trivia', 'scavengerhunt'];
		return validActivityTypes.indexOf(activityType);
	};
	
	function getActivityType(activityId) {
		if (activityId.indexOf('-') > 0) {
			const split = activityId.split('-');
			return split[0];
		}
		else {
			return activityId;
		}
		
	};

	async function checkForUser(event) {
		try {
			const pageId = event.user.id;
			const exists = await andybot.userExists(pageId);
			if (exists === false) {
				event.reply('#welcome');
				andybot.createUser(pageId, event.user.first_name);
			} 
		} catch (err){
			console.error(err);
			event.reply('#error');
		}
	}

	// Catch get started button press
	// As well as any codes scanned
	async function getStarted(event, next) {
		try {
			const pageId = event.user.id;
			const exists = await andybot.userExists(pageId);
			if (exists === false) {
				event.reply('#welcome');
				andybot.createUser(pageId, event.user.first_name);
			} else {
				const user = await andybot.getUser(pageId);
				event.reply('#welcome-back', { user });
			}

			// Get Started may have an associated event.
			let referral;
			if (utils.isNonNull(event.raw.postback.referral) && utils.isNonNull(event.raw.postback.referral.ref)) {
				console.log("SCANNED CODE BEFORE GETTING STARTED:") 
				console.log(event.raw.postback.referral.ref);
				referral = event.raw.postback.referral.ref;
				await handleScan(referral, event);
			} 
		} catch (err){
			console.error(err);
			event.reply('#error');
		}
	}

	// Catch scanned codes
	async function fallBackHandler(event, next) {
		// console.log(event.raw.referral);
		await checkForUser(event);
		// console.log("Checked for user")
		if (utils.isNonNull(event.raw.referral) && utils.isNonNull(event.raw.referral.ref)) {
			// A code was scanned
			// console.log("SCANNED CODE:") 
			// console.log(event.raw.referral.ref);
			await handleScan(event.raw.referral.ref, event)
		}
	}

	async function howToPlay(event, next){
		await checkForUser(event);
 		if (bp.convo.find(event)) {
			await stopConvo(event, null, false);
		}
		const howtoplay = activities['howtoplay'];
		event.reply('#how-to-play', { howtoplay });
		return;
	}

	async function clearHunt(event, next) {
		await checkForUser(event);
		const pageId = event.user.id;
		const cleared = await andybot.scavengerhunt.clearProgress(pageId);
		event.reply("#scavengerhunt-clearhunt");
		try {
			scavengerHuntHandler(null, event, null);
		} catch (err) {
			console.error(err);
		}
	}


	async function sendScavengerHuntHint(event, next) {
		await checkForUser(event);
		const clueNumber = event.raw.postback.payload.split(':')[1];		
		const hintResponse = await andybot.scavengerhunt.getHint(clueNumber);
		event.reply("#scavengerhunt-hint", { hint: hintResponse.hint });
		return;
	}
	
	async function startActivity(event, next) {
		await checkForUser(event);
		const activityName = event.raw.postback.payload.split(':')[1];		
		const activityType = getActivityType(activityName);
		if (isValidActivityType(activityType) === false) {
			event.reply('#error');
		}
	
		if (bp.convo.find(event)) {
			await stopConvo(event, null, false);
		}
	
		const convo = bp.convo.create(event);
		try {
			activityHandlers[activityType](convo, event, activityName);
		} catch (err) {
			console.error(err);
		}
	}

	async function seeEvents(event) {
		await checkForUser(event);
		if (bp.convo.find(event)) {
			await stopConvo(event, null, false);
		}

		const avaliableEvents = await andybot.avaliableEvents(event.user.id);
		const payload = {
			template_type: "generic",
			elements: _.map(avaliableEvents.slice(0,9), (ele) => {
				const imageName = _.find(activities['schedule'], (scheduleObj) => {
					return scheduleObj.id === ele.eventId
				}).image;
				return {
					title: ele.title,
					subtitle: ele.subtitle,
					image_url: `${config.staticUrl}${imageName}`,
					buttons: [
						{
							type: "web_url",
							url: ele.link,
							title: "Details"
						}
					]
				}
			})
		}
		
		bp.messenger.sendTemplate(event.user.id, payload, { typing: 2000 })
	}

	async function stopConvo(event, next, sendNotification){
		await checkForUser(event);
		const convo = bp.convo.find(event);
		if (convo) {
			convo.stop('aborted');
			if (sendNotification === true) {
				event.reply('#activity_ended');
				const avaliableActivities = await andybot.avaliableActivities(event.user.id);
				event.reply('#activities', { activities: _.shuffle(avaliableActivities).slice(0, 9) });
			}
		} else {
			event.reply('#no_activity');
		}
	}

	async function beginAdventure(event, next) {
		await checkForUser(event);
		const avaliableActivities = await andybot.avaliableActivities(event.user.id);
		event.reply('#activities', { activities: _.shuffle(avaliableActivities).slice(0, 9) });
	}


	bp.fallbackHandler = fallBackHandler;

	bp.hear(/GET_STARTED/i, getStarted);

	bp.hear(/START_ACTIVITY:/, startActivity);

	bp.hear(/SEE_EVENTS/, seeEvents);

	bp.hear(/SCAVENGER_HUNT_HINT:/, sendScavengerHuntHint);

	bp.hear(/HOW_TO_PLAY/, howToPlay);

	bp.hear(/BEGIN_ADVENTURE/, beginAdventure);

	bp.hear(/CLEAR_HUNT/, clearHunt);

	bp.hear(/STOP_CONVO/, (event, next) => { stopConvo(event, next, true) });

	eventHandlers.fallBackHandler = fallBackHandler;
	eventHandlers.getStarted = getStarted;
	eventHandlers.clearHunt = clearHunt;
	eventHandlers.howToPlay = howToPlay;
	eventHandlers.stopConvo = stopConvo;
	eventHandlers.startActivity = startActivity;
	eventHandlers.sendScavengerHuntHint = sendScavengerHuntHint;
};


module.exports.eventHandlers = eventHandlers;
