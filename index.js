const postbacks = require('./src/postbacks');
const andybot = require('./src/andybot');

// const config = require('./src/config.js');

const activities = require('./src/activities.json');

const TriviaHandler = require('./src/trivia');
const PollHandler = require('./src/poll');
const utils = require('./utils');

const activityHandlers = {
	trivia: TriviaHandler,
	poll: PollHandler
};
const _ = require('lodash');


module.exports = function (bp) {

	bp.fallbackHandler = async function (event, next) {
		if (event.type === 'postback' || event.type === 'message' || event.type === 'referral') {
			let referral;
			if (utils.isNonNull(event.raw.referral)) {
				referral = event.raw.referral;
			} else if (utils.isNonNull(event.raw.postback) && utils.isNonNull(event.raw.postback.referral)) {
				referral = event.raw.postback.referral;
			}
			if (utils.isNonNull(referral)) {
				const scanResponse = await andybot.scan.scanCode(event.user.id, referral.ref);
				console.log(scanResponse);
				
				// 1. Handle stamp unlock
				if (utils.isNonNull(scanResponse) && utils.isNonNull(scanResponse.stamp)){
					if (scanResponse.stamp.error && scanResponse.stamp.error === "DailyLimitReached") {
						event.reply("#daily_scan_limit_reached");
						return;
					} else {
	
						const stampObj = _.find(activities.stamps, (s) => s.stamp_id === scanResponse.code.ref)
						const image = stampObj.splash_image;
						event.reply("#stamp_unlock", { image, text: "You unlocked a stamp!"});
						return;
					}
				}
	
				// 2. Handle Possible check in to a museum
				if (scanResponse.scan.type === 'checkin') {
					const avaliableActivities = await andybot.avaliableActivities(event.user.id);
					setTimeout(() => {
						event.reply('#activities', { activities: avaliableActivities.slice(0, 10) });
					}, 2000);
					return;
				} else if (scanResponse.scan.type === 'event') {
					
				} else if (scanResponse.scan.type === 'activity') {
	
				} else if (scanResponse.scan.type === 'reward') {
	
				} else if (scanResponse.scan.type === 'scavengerhunt') {
					

					if (utils.isNonNull(scanResponse.scavengerhunt)){

						if (scanResponse.scavengerhunt.clueNumber === 0) {
							event.reply("scavengerhunt-firstclue", scanResponse.scavengerhunt);
							return
						}

						if (utils.isNonNull(scanResponse.scavengerhunt.followup)) {
							event.reply("scavengerhunt-followup-clue", scanResponse.scavengerhunt);
							return
						} else {
							event.reply("scavengerhunt-clue", scanResponse.scavengerhunt);
							return;	
						}
					}
				}
			}
		}
	};
	// Listens for a first message (this is a Regex)
	// GET_STARTED is the first message you get on Facebook Messenger
	bp.hear(/GET_STARTED/i, async (event, next) => {




		// if (utils.isNonNull(referral) && referral.ref === '5099658e') {
		// 	// 1. Allow checkin functionality
		// 	// 1.5 Make sure you can't scan more than once.
		// 	// 

		// 	// 2. Allow activity trigger scan
		// 	event.reply('#checkin-stamp', { image: 'andy-checkin-AAM.png', text: 'Welcome to the American Alliance of Musums conference. You just got a new stamp!' });
		// }


		// await new Promise((resolve, reject) => setTimeout(resolve, 2000));

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
			// let referral;
			// if (utils.isNonNull(event.raw.referral)) {
			// 	referral = event.raw.referral;
			// } else if (utils.isNonNull(event.raw.postback) && utils.isNonNull(event.raw.postback.referral)) {
			// 	referral = event.raw.postback.referral;
			// }
			//			
			// handle referral



		} catch (err){
			console.error(err);
			event.reply('#error');
		}
	});

	bp.hear(postbacks.HOW_TO_PLAY, (event, next) => {
		event.reply('#how_to_play');
	});

	/**
	 * Activities are a session with the user that completes a well defined
	 * task such as answering a trivia set or poll, or following clues on
	 * a scavenger hunt.
	 */
	bp.hear(new RegExp(`${postbacks.BEGIN_ADVENTURE}`), async (event, next) => {



		const avaliableActivities = await andybot.avaliableActivities(event.user.id);
		console.log(avaliableActivities)
		event.reply('#activities', { activities: avaliableActivities.slice(0, 10) });
	});

	/** Finds the current convo for the user and ends it. A convo is used
	 * to represent a persisted, active session of input-output between the
	 * bot and user. Used to enable activities such as trivia, polls etc.
	 */

	 bp.hear('STOP_CONVO', (event, next) => {
		const convo = bp.convo.find(event);
		if (convo) {
			convo.stop('aborted');
			event.reply('#activity_ended');
		}
	});
	
	bp.hear(/START_ACTIVITY:/, (event, next) => {
		const activityName = event.raw.postback.payload.split(':')[1];		
		const activityType = getActivityType(activityName);
		if (isValidActivityType(activityType) === false) {
			event.reply('#error');
		}

		if (bp.convo.find(event)) {
			return event.reply('#askStopConvo', { object: 'trivia' });
		}

		const convo = bp.convo.create(event);
		try {
			activityHandlers[activityType](convo, event, activityName);
			console.log(`${activityName} started`);
		} catch (err) {
			console.err(err);
		}
	});

	bp.hear(/SCAVENGER_HUNT_HINT:/, async (event, next) => {
		const clueNumber = event.raw.postback.payload.split(':')[1];		
		const hintResponse = await andybot.scavengerhunt.getHint(clueNumber);
		event.reply("#scavengerhunt-hint", { hint: hintResponse.hint });
		return;
		// console.log("GET SCAVENGER HUNT HINT", event.raw);
		// console.log("clueNumber")
	});


	bp.hear(new RegExp(postbacks.PRIZES), (event, next) => {
		event.reply('#prizes');
	});
};

const isValidActivityType = function (activityType) {
	const validActivityTypes = ['poll', 'trivia', 'scavengerhunt'];
	return validActivityTypes.indexOf(activityType);
};

const getActivityType = function (activityId) {
	if (activityId.indexOf('-') < 0) {
		throw new Error('Invalid activity name');
	}
	const split = activityId.split('-');
	return split[0];
};
