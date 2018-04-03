const postbacks = require('./src/postbacks');
const andybot = require('./src/andybot');
const activities = require('./src/activities.json');
const config = require('./src/config.js');
const _ = require('lodash');
module.exports = function (bp) {

	// Listens for a first message (this is a Regex)
	// GET_STARTED is the first message you get on Facebook Messenger
	bp.hear(/GET_STARTED/i, async (event, next) => {
    try {
      const pageId = event.user.id;
      const exists = await andybot.userExists(pageId);
      if (exists === false) {
        const user = await andybot.createUser(pageId, event.user.first_name);
        event.reply('#welcome');
      } else {
        const user = await andybot.getUser(pageId);
        event.reply('#welcome-back', { user });
      }
    } catch (err){
      console.log(err);
      event.reply('#error');
    }
	})

	bp.hear(new RegExp(postbacks.HOW_TO_PLAY), (event, next) => {
		event.reply('#how_to_play');
  })
  
  bp.hear(new RegExp(postbacks.BEGIN_ADVENTURE), (event, next) => {
    event.reply('#activities', { activities: activities.manifest } );
  })

  bp.hear('STOP_CONVO', (event, next) => {
    const convo = bp.convo.find(event)
    if (convo) {
      convo.stop('aborted')
    }
  })

  bp.hear('STOP_CONVO', (event, next) => {
    const convo = bp.convo.find(event)
    if (convo) {
      convo.stop('aborted')
    }
  })
  
  bp.hear(/START_ACTIVITY:/, (event, next) => {
    const activityName = event.raw.postback.payload.split(':')[1];
    if (bp.convo.find(event)) {
      return event.reply('#askStopConvo', { object: 'trivia' })
    }
    const convo = bp.convo.create(event);
    const activity = activities[activityName];
    const activityTitle = _.find(activities.manifest, (e) => e.activity === activityName).title;
    event.reply("#trivia-time", { name: activityTitle, numQuestions: activity.length });
    // Sets postbacks as an acceptable answer type
    convo.messageTypes = ['postback', 'quick_reply']; 
    for (var i = 0; i < activity.length; i++) {
      const followUp = activities[activityName][i].followup;
      const isLastQuestion = i === activity.length - 1;
      const options = [ ...activity[i].incorrect, activity[i].answer ];
      const choices = _.shuffle(options);
      const correctAnswer = activity[i].answer;
      convo.threads['default'].addQuestion(
        '#trivia-question',
        {
          question: activity[i],
          questionNumber: i + 1,
          choices
        },
        [
          {
            default: true, 
            callback: response => {
              const answer = response.raw.postback.title;
              let feedback;
              if (correctAnswer === answer) {
                feedback = 'Correct!'
              } else {
                feedback = 'The answer is ' + correctAnswer + '.';
              }
              console.log(response);
              convo.say("#trivia-followup", { text: followUp, feedback })
              if (isLastQuestion === false) {
                convo.next()
              } else {
                convo.say("#trivia-complete", { score: 100 });
                convo.stop('aborted');
              }
            }
          }
        ]
      );
    }    
    convo.activate();
  })


	bp.hear(new RegExp(postbacks.PRIZES), (event, next) => {
		event.reply('#prizes');
  })
}