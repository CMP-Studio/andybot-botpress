const _ = require('lodash');

const andybot = require('./andybot');

const utils = require('./utils');

let activities;

module.exports = async function TriviaHandler(convo, event, activityName) {

	// Fetch the activities avaliable
	if (utils.isNull(activities)) {
		// activities = await andybot.activity.avaliable();
		activities = require('./activities.json');
	}

	const userPageId = event.user.id;
	const activity = activities[activityName];
	const activityTitle = _.find(activities.manifest, (e) => e.activity === activityName).title;
	event.reply('#trivia-time', { name: activityTitle, numQuestions: activity.length });
	let correctAnswers = 0;
	// Sets postbacks as an acceptable answer type
	convo.messageTypes = ['postback', 'quick_reply']; 
	const numQuestions = activity.length;
	for (var i = 0; i < numQuestions; i++) {
		const followUp = activities[activityName][i].followup;
		const isLastQuestion = i === numQuestions - 1;
		const options = [ ...activity[i].incorrect, activity[i].answer ];
		const choices = _.shuffle(options);
		const correctAnswer = activity[i].answer;

		const responseCallback = async (response) => {
			const answer = response.raw.postback.title;
			let feedback;
			if (correctAnswer === answer) {
				feedback = 'Correct!';
				correctAnswers += 1;
			} else {
				feedback = 'The answer is ' + correctAnswer + '.';
			}
			convo.say('#trivia-followup', { text: followUp, feedback });
			if (isLastQuestion === false) {
				convo.next();
			} else {
				// Submit trivia scores
				// await andybot.trivia.submitScore(userPageId, activityName, correctAnswers, numQuestions);

				const scoreText = getScoreText(correctAnswers, activity.length);
				convo.say('#trivia-complete', { scoreText: scoreText });
				
				if (correctAnswer >= 9) {
					convo.say('#achievement-unlocked', {
						achievements: [{
							id: "smart-cookie",
							displayName: "Smart Cookie",
							description: "Do you think you have what it takes to ace every trivia set?",
							image: "achievement-smart-cookie.png",
							splash_image: "andy-smart-cookie.png",
							maxProgress: 1,
							progress: 1,
							tiers: {
								1: {
									displayName: "Smart Cookie",
									description: "Get over 90% on a quiz",
									reward: 10
								}
							}
						}],
						reward: 10
					});
				}

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

				convo.say('#more-activities', { activities: _.filter(activities.manifest, (a)=>  a.activity !== activityName) });
				convo.stop('aborted');
			}
		};

		convo.threads['default'].addQuestion(
			'#trivia-question',
			{
				question: activity[i],
				questionNumber: i+1,
				choices
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

function getScoreText(correct, total) {
	return `You scored ${Math.round(((correct*1.0)/total)*100)}%`;
}