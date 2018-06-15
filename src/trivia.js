const _ = require('lodash');

const andybot = require('./andybot');

const utils = require('./utils');

let activities;

const handleScan = require('./scan');

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
				console.log("SCAN from trivia");
				await handleScan(referral, event);
				return;
			}

			const answer = response.raw.postback.title;
			let feedback;
			if ((String(correctAnswer)).toLowerCase() === String(answer).toLowerCase()) {
				feedback = '👍 Correct!';
				correctAnswers += 1;
			} else {
				feedback = '❌ Incorrect. The answer is ' + correctAnswer + '.';
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

				let score = Math.round(((correctAnswers*1.0)/activity.length)*100);

				if (isNaN(score)) {
					convo.say('#trivia-complete');
				} else if (score === 100) {
					convo.say('#trivia-complete-smartcookie', { score });
				} else if (score > 60) {
					convo.say('#trivia-complete-quizwiz', { score });
				} else {
					convo.say('#trivia-complete-quizwiz-low');
				}

				const avaliableActivities = await andybot.avaliableActivities(event.user.id);
				convo.say('#more-activities', { activities: avaliableActivities.slice(0, 9) });
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
