/*
  Here's the next steps for you:
  1. Read this file to understand how this simple bot works
  2. Read the `content.yml` file to understand how messages are sent
  3. Install a connector module (Facebook Messenger and/or Slack)
  4. Customize your bot!

  Happy bot building!

  The Botpress Team
  ----
  Getting Started (Youtube Video): https://www.youtube.com/watch?v=HTpUmDz9kRY
  Documentation: https://botpress.io/docs
  Our Slack Community: https://slack.botpress.io
*/

const postbacks = require('./src/postbacks');

module.exports = function (bp) {
	// Listens for a first message (this is a Regex)
	// GET_STARTED is the first message you get on Facebook Messenger
	bp.hear(/GET_STARTED|hello|hi|test|hey|holla/i, (event, next) => {
		event.reply('#welcome');
	})

	bp.hear(new RegExp(postbacks.HOW_TO_PLAY), (event, next) => {
		event.reply('#how_to_play');
	})

	bp.hear(new RegExp(postbacks.PRIZES), (event, next) => {
		event.reply('#prizes');
	})
}