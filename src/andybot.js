const axios = require('axios');
const config = require('./config');

module.exports = {
	createUser: async function (page_id, name){ 
		const response = await axios.post(`${config.apiEndpoint}/createUser`,
			{ page_id, name },
			{ headers: { 'Content-Type': 'application/json'} });

		return response.data;
	},

	userExists: async function (page_id) {
		const response = await axios.post(`${config.apiEndpoint}/userExists`, 
			{ page_id },
			{ headers: { 'Content-Type': 'application/json'} });
		return Boolean(response.data); 
	},

	getUser: async function (page_id) {
		const response = await axios.post(`${config.apiEndpoint}/getUser`, 
			{ page_id },
			{ headers: { 'Content-Type': 'application/json'} });
		return response.data; 
	},

	activity: {
		avaliable: async function () {
			const response = await axios.get(`${config.apiEndpoint}/avaliableActivities`, 
				{ headers: { 'Content-Type': 'application/json'} }
			);
			return response.data;
		}
	},

	trivia: {

		submitScore: async function(fb_page_id, activity_id, correct, total) {
			const rsp = await axios.post(`${config.apiEndpoint}/trivia/submitScore`, 
				{ fb_page_id, activity_id, correct, total },
				{ headers: { 'Content-Type': 'application/json'} });
			return rsp.data; 
		}
	},

	achievement: {
		
		progress: async function(fb_page_id) {
			const rsp = await axios.post(`${config.apiEndpoint}/achievement/progress`, 
				{ fb_page_id },
				{ headers: { 'Content-Type': 'application/json'} });
			return rsp.data; 
		}
	},

	poll: {

		submitResponse: async function(fb_page_id, activity_id, question_number, answer) {
			const rsp = await axios.post(`${config.apiEndpoint}/poll/submitResponse`, 
				{ fb_page_id, activity_id, question_number, answer },
				{ headers: { 'Content-Type': 'application/json'} });
			return rsp.data; 
		}
	}
};
