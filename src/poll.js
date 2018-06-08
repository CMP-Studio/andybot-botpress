const _ = require('lodash');

const andybot = require('./andybot');

const utils = require('./utils');
const handleScan = require('./scan');
let activities = utils.activities();

module.exports = async function PollHandler(convo, event, activityName) {

	const userPageId = event.user.id;
	const activity = activities[activityName];
	const activityTitle = _.find(activities.manifest, (e) => e.activity === activityName).title;
    const pollImage = activity[0].image;

	event.reply('#poll-time', { name: activityTitle, numQuestions: activity.length, image: pollImage });
	// Sets postbacks as an acceptable answer type
	convo.messageTypes = ['postback', 'quick_reply']; 
	const numQuestions = activity.length;
	for (var i = 0; i < numQuestions; i++) {
		const followUp = activities[activityName][i].followup;
		const isLastQuestion = i === numQuestions - 1;
		const choices = activities[activityName][i].choices;
		const images = activities[activityName][i].images;
		const questionIndex = i;
		const responseCallback = async (response) => {


			let referral;
			if (utils.isNonNull(response.raw.referral)) {
				referral = response.raw.referral;
				await handleScan(referral, event);
				return;
			}

			let answer;
			try {
				answer = parseInt(response.raw.postback.payload.split(':')[1], 10);
			} catch (err) {
				event.reply('Not sure what you meant there.');
			}

			let responseSubmitted;
			try {
				responseSubmitted = await andybot.poll.submitResponse(userPageId, activityName, questionIndex, answer);
			} catch (err) {
				console.log("Poll response error");
				console.log(err.message);
			}

			if (responseSubmitted.error === 'AlreadySumbitted') {
				convo.say('#poll-doubledip');
				const avaliableActivities = await andybot.avaliableActivities(event.user.id);
				convo.say('#more-activities', { activities: avaliableActivities.slice(0, 9) });
				convo.stop('aborted');
			} else {

				const userResponses = await andybot.poll.getResponsesForQuestion(activityName, questionIndex);

				const totalAnswers = _.sum(userResponses);
				let followUpStatement;
				const minPollAnswerLimit = 3;
				if (totalAnswers < minPollAnswerLimit) {
					followUpStatement = `You are one of the first people to answer this question!`;
				} else {
					const agreedWithMe = userResponses[answer];
					const agreedWithMePercentage = Math.ceil((agreedWithMe / (totalAnswers * 1.0)) * 100);
					followUpStatement = `${agreedWithMePercentage}% of people agree with you.`;
				}

				convo.say('#poll-followup', { text: followUp, feedback:  followUpStatement });

				if (isLastQuestion === false) {
					convo.next();
				} else {
					convo.say('#poll-complete');

					// const achievement = await andybot.achievement.progress(userPageId);
					// if (utils.isNonNull(achievement.new) && achievement.new.length > 0) {
					// 	// Send achievement unlocked message
					// 	const totalReward = _.reduce(_.map(({tiers, progress}) => tiers[progress].reward), (x, y) => x + y, 0);
					// 	const unlocked = _.map(achievement.new, (ach) => ({
					// 		image: ach.splash_image,
					// 		displayName: ach.tiers[ach.progress].displayName,
					// 		description: ach.tiers[ach.progress].description, 
					// 	}));
					// 	convo.say('#achievement-unlocked', {
					// 		achievements: unlocked,
					// 		reward: totalReward
					// 	});
					// }
					const avaliableActivities = await andybot.avaliableActivities(event.user.id);
					convo.say('#more-activities', { activities: avaliableActivities.slice(0, 9) });
					convo.stop('aborted');
				}
			}
		};

		const zippedChoices = _.map(choices, (choice, index) => {
			return { text: choice, image: images[index], choiceIndex: index, choiceNumber: index+1 };
		});
		convo.threads['default'].addQuestion(
			'#poll-question',
			{
				question: activity[i].question,
				questionNumber: i+1,
				choices: zippedChoices,
			},
			[
				{
					default: true, 
					callback: responseCallback
				}
			]
		);
	}
	convo.activate();	
};
