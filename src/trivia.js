const _ = require('lodash');

const andybot = require('./andybot');

const utils = require('./utils');

let activities;

module.exports = async function TriviaHandler(convo, event, activityName) {

	if (utils.isNull(activities)) {
		activities = require('./activities.json');
	}

	const userPageId = event.user.id;
	const activity = activities[activityName];
	const activityTitle = _.find(activities.manifest, (e) => e.activity === activityName).title;
	if ( utils.isNull(activity)){
		return 
		
	}

	event.reply('#trivia-time', { name: activityTitle, numQuestions: activity.length });
	let correctAnswers = 0;
	// Sets postbacks as an acceptable answer type
	convo.messageTypes = ['postback', 'quick_reply', 'referral']; 
	const numQuestions = activity.length;
	for (var i = 0; i < numQuestions; i++) {
		const followUp = activities[activityName][i].followup;
		const isLastQuestion = i === numQuestions - 1;
		const options = [ ...activity[i].incorrect, activity[i].answer ];
		const choices = _.shuffle(options);
		const correctAnswer = activity[i].answer;

		const responseCallback = async (response) => {

			// Possible scan between activity session -__-
			let referral;
			if (utils.isNonNull(response.raw.referral)) {
				referral = response.raw.referral;
				const scanResponse = await andybot.scan.scanCode(event.user.id, referral.ref);
				if (utils.isNonNull(scanResponse.stamp)){
					if (scanResponse.stamp.error && scanResponse.stamp.error === "DailyLimitReached") {
						convo.say("#daily_scan_limit_reached");
						convo.repeat();
						return;
					} else {
	
						const stampObj = _.find(activities.stamps, (s) => s.stamp_id === scanResponse.code.ref)
						const image = stampObj.splash_image;
						convo.say("#stamp_unlock", { image, text: "You unlocked a stamp!"});
						convo.repeat();
						return;
					}
				}
			}



			const answer = response.raw.postback.title;
			let feedback;
			if (correctAnswer === answer) {
				feedback = 'Correct!';
				correctAnswers += 1;
			} else {
				feedback = 'The answer is ' + correctAnswer + '.';
			}

			if (utils.isNonNull(followUp)) {
				convo.say('#trivia-followup', { text: followUp, feedback });
			} else {
				convo.say('#trivia-followup-short', { feedback });
			}
			
			if (isLastQuestion === false) {
				convo.next();
			} else {
				// Submit trivia scores
				await andybot.trivia.submitScore(userPageId, activityName, correctAnswers, numQuestions);

				const scoreText = getScoreText(correctAnswers, activity.length);
				convo.say('#trivia-complete', { scoreText: scoreText });

				const achievement = await andybot.achievement.progress(userPageId);
				if (utils.isNonNull(achievement.new) && achievement.new.length > 0) {
					// Send achievement unlocked message
					const totalReward = _.reduce(_.map(({tiers, progress}) => tiers[progress].reward), (x, y) => x + y, 0);
					const unlocked = _.map(achievement.new, (ach) => ({
						image: ach.splash_image,
						displayName: ach.tiers[ach.progress].displayName,
						description: ach.tiers[ach.progress].description, 
					}));
					convo.say('#achievement-unlocked', {
						achievements: unlocked,
						reward: achievement.reward
					});
				}

				const avaliableActivities = await andybot.avaliableActivities(event.user.id);
				convo.say('#more-activities', { activities: avaliableActivities.slice(0, 10) });
				convo.stop('aborted');
			}
		};


		if (
			utils.isNonNull(activities[activityName][i].text) && 
			utils.isNonNull(activities[activityName][i].image)
		){
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
		} else if (
			utils.isNull(activities[activityName][i].image) &&
			utils.isNonNull(activities[activityName][i].text)
		) {
			convo.threads['default'].addQuestion(
				'#trivia-question-no-image',
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
		} else if (utils.isNonNull(activities[activityName][i].image)){
			convo.threads['default'].addQuestion(
				'#trivia-question-short',
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
	}
	convo.activate();	
};

function getScoreText(correct, total) {
	return `You scored ${Math.round(((correct*1.0)/total)*100)}%`;
}